from flask import Blueprint


def _init_bp(view_path, url_prefix):
    """
    Creates flask blueprints.

    Args:
    view_path: Realtive path to view.
    url_prefix: URL prefix passed to the blueprint.

    Returns:
        A constructed blueprint.
    """
    blueprint = Blueprint(
        view_path,
        'app.views.{}'.format(view_path),
        static_url_path='static',
        template_folder='templates',
        url_prefix=url_prefix
    )
    return blueprint


index_home = _init_bp('index.home', '/')

app_blueprints = (
    index_home,
)
