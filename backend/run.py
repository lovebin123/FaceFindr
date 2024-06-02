from backend_app import python_backend
app = python_backend()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)
