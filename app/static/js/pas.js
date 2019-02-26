/**
 * Constructs a course object.
 *
 * Args:
 *  name (OPTIONAL | str)
 *  num_students (OPTIONAL | int)
 *  students (OPTIONAL | obj[])
 *  current (OPTIONAL | int)
 *
 * Returns: Course (obj)
 */
function Course(name = "", num_students = 0, students = [], current = 0) {
  return {
    name: name,
    num_students: num_students,
    students: students,
    current: current,
    /**
     * Sets the name of the course.
     *
     * Args: new_name (REQUIRED | str)
     *
     * Returns: none
     */
    set_name: function(new_name) {
      this.name = new_name;
    },
    /**
     * Returns the name of the course.
     *
     * Args: none
     *
     * Returns: name (str)
     */
    get_name: function() {
      return this.name;
    },
    /**
     * Sets the number of students in the course.
     *
     * Args: new_num_students (REQUIRED | int)
     *
     * Returns: none
     */
    set_num_students: function(new_num_students) {
      this.num_students = new_num_students;
    },
    /**
     * Returns the number of students in the course.
     *
     * Args: none
     *
     * Returns: num_students (int)
     */
    get_num_students: function() {
      return this.num_students;
    },
    /**
     * Sets the current student counter for the course.
     *
     * Args: new_current (REQUIRED | int)
     *
     * Returns: none
     */
    set_current: function(new_current) {
      this.current = new_current;
    },
    /**
     * Checks if a student exists in the course and if not, adds them to the
     * course and increments the number of students in the course.
     *
     * Args: student (REQUIRED | obj)
     *
     * Returns: boolean
     */
    add_student: function(student) {
      students_index = this.student_exists(student.get_name());
      if (students_index !== false) {
        return false;
      }

      this.students.push(student);
      this.num_students++;
      return true;
    },
    /**
     * Checks if a student exists in the course and if it does removes that
     * student and decrements the number of students in the course. Returns true
     * if the student was removed and false if not.
     *
     * Args: student_name (REQUIRED | str)
     *
     * Returns: bool
     */
    remove_student: function(student_name) {
      students_index = this.student_exists(student_name);
      if (students_index === false) {
        return false;
      }

      this.students.splice(students_index, 1);
      this.num_students--;
      return true;
    },
    /**
     * Checks if a student exists in the course.
     *
     * Args: student_name (REQUIRED | str)
     *
     * Returns: student_exists (bool)
     */
    student_exists: function(student_name) {
      var student_exists = false;
      for (var x = 0; x < this.num_students; x++) {
        if (this.students[x].get_name() == student_name) {
          console.log("FOUND EM");
          student_exists = x;
          break;
        }
      }

      return student_exists;
    },
    /**
     * Shuffles the order of students in the course.
     *
     * Args: none
     *
     * Returns: none
     */
    shuffle: function() {
      for (var x = this.num_students - 1; x > 0; x--) {
        var swap = Math.floor(Math.random() * (x + 1));
        [this.students[x], this.students[swap]] = [this.students[swap], this.students[x]]
      }
    },
    /**
     * Returns current student that will be asked a question. If the current
     * counter is equal to or greater than the number of students in the
     * course, the students will be shuffled and the current counter will be
     * reset to zero.
     *
     * Args: none
     *
     * Returns: student (obj)
     */
    get_current: function() {
      if (this.current >= this.num_students) {
        this.current = 0;
        this.shuffle();
      }

      return this.students[this.current];
    },
    /**
     * Increments the given grade counter for the current student.
     *
     * Args:
     *  grade (REQUIRED | str) must be one of ["correct", "absent", "incorrect"]
     *
     * Returns: none
     */
    grade_student: function(grade) {
      switch (grade) {
        case "correct":
          this.students[this.current].correct++;
          break;
        case "absent":
          this.students[this.current].absent++;
          break;
        case "incorrect":
          this.students[this.current].incorrect++;
          break;
      }
      this.current++;
    },
    /**
     * Formats the content of the course into csv format. The file is formatted
     * as such: Each line denotes in order the student name, correct grade,
     * absent grade, and incorrect grade. The final line of the output must
     * indicate the current counter denoted first by "__index__" and then the
     * actual counter value.
     *
     * Args: none
     *
     * Returns: csv (str)
     */
    to_csv: function() {
      var csv = "";
      this.students.forEach(function(st) {
        csv += st.get_name() + "," + st.get_correct() + "," + st.get_absent() + "," + st.get_incorrect() + "\n";
      });
      csv += "__index__," + this.current;

      return csv;
    }
  };
}

/**
 * Constructs a student object.
 *
 * Args:
 *  name (OPTIONAL | str)
 *  correct (OPTIONAL | int)
 *  absent (OPTIONAL | obj[])
 *  incorrect (OPTIONAL | int)
 *
 * Returns: Student (obj)
 */
function Student(name = "", correct = 0, absent = 0, incorrect = 0) {
  return {
    name: name,
    correct: correct,
    absent: absent,
    incorrect: incorrect,
    /**
     * Sets the name of the student.
     *
     * Args: new_name (REQUIRED | str)
     *
     * Returns: none
     */
    set_name: function(new_name) {
      this.name = new_name;
    },
    /**
     * Returns the name of the student.
     *
     * Args: none
     *
     * Returns: name (str)
     */
    get_name: function() {
      return this.name;
    },
    /**
     * Sets the student's correct grade.
     *
     * Args: new_correct (REQUIRED | int)
     *
     * Returns: none
     */
    set_correct: function(new_correct) {
      this.correct = new_correct;
    },
    /**
     * Returns the student's correct grade.
     *
     * Args: none
     *
     * Returns: correct (int)
     */
    get_correct: function() {
      return this.correct;
    },
    /**
     * Sets the student's absent grade.
     *
     * Args: new_absent (REQUIRED | int)
     *
     * Returns: none
     */
    set_absent: function(new_absent) {
      this.absent = new_absent;
    },
    /**
     * Returns the student's absent grade.
     *
     * Args: none
     *
     * Returns: absent (int)
     */
    get_absent: function() {
      return this.absent;
    },
    /**
     * Sets the student's incorrect grade.
     *
     * Args: new_incorrect (REQUIRED | int)
     *
     * Returns: none
     */
    set_incorrect: function(new_incorrect) {
      this.incorrect = new_incorrect;
    },
    /**
     * Returns the student's incorrect grade.
     *
     * Args: none
     *
     * Returns: incorrect (int)
     */
    get_incorrect: function() {
      return this.incorrect;
    }
  };
}