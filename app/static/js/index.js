window.COURSE = null;
window.STUDENT = null;

/**
 * Alerts the user.
 *
 * Args:
 *  type (REQUIRED | str): For example, "ERROR" or "SUCCESS" describes the
 *                         nature of the announcement.
 *  msg (REQUIRED | str): The message that you want to convery to the user.
 *
 * Returns: none
 */
function announcement(type, msg) {
  alert(type + " " + msg);
}

/**
 * Updates the gui element that indicates the student to ask a question to.
 *
 * Args: none
 *
 * Returns: none
 */
function update_current_student() {
  STUDENT = COURSE.get_current();
  $('#current_student').val(STUDENT.get_name());
}

/**
 * Used to check if the current student gui element and start the student
 * picking process if it's empty.
 *
 * Args: none
 *
 * Returns: none
 */
function init() {
  var current_student = $('#current_student').val().trim();
  if (!current_student) {
    update_current_student();
  }
}

/**
 * Updates the gui element which lists all students in the course in order to
 * select one for removal if in the case a student drops the course or an
 * extra student is added accidentally.
 *
 * Args: none
 *
 * Returns: none
 */
function update_remove_options() {
  $('#delete_student_name')[0].options.length = 0;
  for (var x = 0; x < COURSE.get_num_students(); x++) {
    var name = COURSE.students[x].get_name();
    console.log(name);
    $('#delete_student_name').append($('<option>', {
      value: name,
      text: name
    }));
  }
}

$(document).ready(function() {
  /**
   * Toggle the edit panel so the user can create a course and add/remove
   * students from a loaded or created course.
   */
  $('#edit-toggle').click(function() {
    $('#file').slideUp();
    $('#edit').slideToggle();
  });

  /**
   * Toggle the file panel so the user can save or load a course.
   */
  $('#file-toggle').click(function() {
    $('#edit').slideUp();
    $('#file').slideToggle();
  });

  /**
   * Create a new course, but first check if a course already exists that hasn't
   * been saved yet or if a name for the new course has not been specified.
   */
  $('#create_course').click(function() {
    var course_name = $('#new_course_name').val().trim();
    if (COURSE) {
      announcement("ERROR:", "A course is already in progress. Save it before continuing.");
      return;
    }
    if (!course_name) {
      announcement("ERROR:", "No course name was specified.");
      return;
    }

    COURSE = Course(course_name);

    announcement("SUCCESS:", COURSE.get_name() + " was created.");
    $('#new_course_name').val("");
  });

  /**
   * Add a student to the course, but first check if a course is currently in
   * progress, if a name for the new student has not been specified or if the
   * student already exists in the course.
   */
  $('#add_student').click(function() {
    var student_name = $('#new_student_name').val().trim();
    if (!COURSE) {
      announcement("ERROR:", "No course has been created or loaded.");
      return;
    }
    if (!student_name) {
      announcement("ERROR:", "No student name was specified to add.");
      return;
    }
    new_student = Student(student_name);
    if (!COURSE.add_student(new_student)) {
      announcement("ERROR:", new_student + " already exists in " + COURSE.get_name() + ".");
      return;
    }

    $('#new_student_name').val("");
    update_remove_options();
  });

  /**
   * Remove a student from the course, but first check if a course is currently
   * in progress, if a name for the new student has not been specified or if the
   * student already exists in the course. The action must also be confirmed by
   * the user before it is enacted.
   */
  $('#delete_student').click(function() {
    var student_name = $('#delete_student_name').val().trim();
    if (!COURSE) {
      announcement("ERROR:", "No course has been created or loaded.");
      return;
    }
    if (!student_name) {
      announcement("ERROR:", "No student name was specified to delete.");
      return;
    }
    if (!confirm("Are you sure you want to remove " + student_name + "?")) {
      return;
    }
    if (!COURSE.remove_student(student_name)) {
      announcement("ERROR:", student_name + " does not exist in " + COURSE.get_name() + ".");
      return;
    }

    announcement("SUCCESS:", student_name + " removed from " + COURSE.get_name() + ".");
    update_remove_options();

    if ($('#current_student').val() == student_name) {
      update_current_student();
    }
  });

  /**
   * Fetch the next student to ask a question to, but first check if a course is
   * currently in progress. If a student is stored in the STUDENT global var,
   * then that student should be graded based on the grade radio input after
   * confirming that the user selected a grade.
   */
  $('#next').click(function() {
    if (!COURSE) {
      announcement("ERROR:", "No course has been created or loaded.");
      return;
    }

    if (STUDENT) {
      var grade = $('input[name="grade"]:checked').val();
      if (!grade) {
        announcement("ERROR:", "No grade has been selected.");
        return;
      }
      COURSE.grade_student(grade);
      document.getElementById(grade).checked = false;
    }

    update_current_student();
  });

  /**
   * Save the course, but first check if a course is currently in progress.
   */
  $('#save_course').click(function() {
    if (!COURSE) {
      announcement("ERROR:", "No course has been created or loaded.");
      return;
    }

    download(COURSE.get_name() + ".csv", COURSE.to_csv());
    COURSE = null;
    $('#current_student').val("")
  });

  /**
   * Load a course, but first check if a course is currently in progress to
   * ensure that any progress on a previous course is not overwritten. Also
   * check if a file as been selected and if the browser supports file uploads.
   */
  $('#load_course').click(function() {
    if (COURSE) {
      announcement("ERROR:", "A course is already in progress. Save it before continuing.");
      return;
    }

    if (!$('#input_file')[0].files.length) {
      announcement("ERROR:", "No file was selected.");
      return;
    }

    if (!browser_supports_file_upload()) {
      announcement("ERROR:", "File API is not supported by this browser.");
      return;
    }

    var file = document.getElementById('input_file').files[0];
    COURSE = Course(file.name.split('.csv')[0]);
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      var csvData = event.target.result;
      csvData.split('\n').forEach(function(data, ind) {
        var line = data.split(',');
        if (line[0] !== "__index__") {
          if (line[0] && line[1] && line[2] && line[3]) {
            COURSE.add_student(Student(line[0], line[1], line[2], line[3]));
          }
        } else {
          COURSE.set_current(line[1]);
        }
      })
    };
    reader.onerror = function() {
      announcement("ERROR:", "Unable to read " + file.name);
      return;
    };

    announcement("SUCCESS:", "Loaded " + file.name);
  });
});