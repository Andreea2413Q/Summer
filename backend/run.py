# backend/run.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'dev-environmental-monitoring-secret-key-2024'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'jwt-environmental-alerts-secret-2024'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    
    print("📋 App configuration loaded...")
    
    # Initialize extensions with app
    try:
        from models import db, bcrypt
        db.init_app(app)
        bcrypt.init_app(app)
        print("✅ Database and bcrypt initialized...")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return None
    
    # JWT Manager
    jwt = JWTManager(app)
    print("✅ JWT Manager initialized...")
    
    # CORS configuration - FOARTE IMPORTANT pentru React
    CORS(app, 
         origins=["http://localhost:3000", "http://127.0.0.1:3000"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"])
    print("✅ CORS configured for React frontend...")
    
    # Test route pentru verificare conexiune
    @app.route('/api/test', methods=['GET'])
    def test_connection():
        return jsonify({
            'message': 'Backend connected successfully!',
            'status': 'working',
            'timestamp': str(__import__('datetime').datetime.now())
        }), 200
    
    # Import routes
    try:
        from routes import auth_bp, main_bp
        app.register_blueprint(auth_bp)
        app.register_blueprint(main_bp)
        print("✅ Routes registered successfully...")
    except Exception as e:
        print(f"❌ Error importing routes: {e}")
        return None
    
    # Create tables and users
    with app.app_context():
        try:
            from models import User
            
            print("🔄 Setting up database...")
            
            # Șterge și recreează tabelele pentru a fi sigur
            db.drop_all()
            db.create_all()
            print("✅ Database tables created...")
            
            # Verifică dacă utilizatorii există deja
            existing_admin = User.query.filter_by(email='viewer2413q@gmail.com').first()
            existing_admin2 = User.query.filter_by(email='admin@treelives.com').first()
            existing_user = User.query.filter_by(email='andreea2.p.3@gmail.com').first()
            
            if not existing_admin:
                # Creează admin
                admin_user = User(
                    name='Administrator',
                    email='viewer2413q@gmail.com',
                    password='admin123',
                    role='admin'
                )
                db.session.add(admin_user)
                print("✅ Admin user prepared...")
            
            if not existing_user:
                # Creează user de test
                test_user = User(
                    name='Andreea Test',
                    email='andreea2.p.3@gmail.com',
                    password='admin123',
                    role='user'
                )
                db.session.add(test_user)
                print("✅ Test user prepared...")
            
            if not existing_admin2:
                # Creează admin alternativ pentru demo/login
                admin_user2 = User(
                    name='Admin',
                    email='admin@treelives.com',
                    password='admin123',
                    role='admin'
                )
                db.session.add(admin_user2)
                print("✅ Secondary admin user prepared (admin@treelives.com)...")
            
            db.session.commit()
            print("✅ Users created successfully!")
            
            # Verifică că utilizatorii s-au creat
            users = User.query.all()
            print(f"📊 Total users in database: {len(users)}")
            for user in users:
                print(f"   👤 {user.email} - {user.role}")
                
        except Exception as e:
            print(f"❌ Error creating users: {e}")
            db.session.rollback()
    
    # Error handlers pentru debugging
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 STARTING ENVIRONMENTAL MONITORING BACKEND")
    print("="*50)
    
    app = create_app()
    
    if app is None:
        print("❌ Failed to create Flask app! Check your imports and dependencies.")
        exit(1)
    
    print("\n📍 Server Information:")
    print("   🌐 URL: http://localhost:5000")
    print("   🌐 Alternative: http://127.0.0.1:5000")
    print("\n🔧 API Endpoints to test:")
    print("   ✅ http://localhost:5000/api/test")
    print("   🔐 http://localhost:5000/api/auth/profile")
    print("   🚨 http://localhost:5000/api/alerts")
    print("   📝 http://localhost:5000/api/auth/login")
    print("   📝 http://localhost:5000/api/auth/register")
    
    print("\n🔍 To test connection, open in browser:")
    print("   http://localhost:5000/api/test")
    
    print("\n🎯 Starting server...")
    print("="*50 + "\n")
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        print("💡 Try running: pip install flask flask-cors flask-jwt-extended flask-sqlalchemy flask-bcrypt")