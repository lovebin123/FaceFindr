from .backend_app import create_app
app = create_app()
app.run(debug=False, port=5050)  # Or use any other suitable configuration
