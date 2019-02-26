from app.app import get_app

if __name__ == '__main__':
    app = get_app()
    app.run(host='127.0.0.1', port=8001, debug=True)
