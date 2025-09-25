# backend/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Alert, db  # Import Alert model
from datetime import datetime
import re

# Blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
main_bp = Blueprint('main', __name__, url_prefix='/api')

# Helper functions
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    return len(password) >= 6

def validate_coordinates(lat, lng):
    try:
        lat = float(lat)
        lng = float(lng)
        return -90 <= lat <= 90 and -180 <= lng <= 180
    except (ValueError, TypeError):
        return False

# Authentication routes
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Validare input
        if not data or not all(k in data for k in ('name', 'email', 'password')):
            return jsonify({'error': 'Missing required fields: name, email, password'}), 400

        name = data['name'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        role = data.get('role', 'user')  # Default la 'user'

        # Validări
        if len(name) < 2:
            return jsonify({'error': 'Name must be at least 2 characters'}), 400

        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if not validate_password(password):
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        if role not in ['user', 'admin']:
            role = 'user'

        # Verifică dacă email-ul există deja
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400

        # Creează utilizatorul nou
        user = User(name=name, email=email, password=password, role=role)
        db.session.add(user)
        db.session.commit()

        # Creează token
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed: ' + str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Email and password required'}), 400

        email = data['email'].strip().lower()
        password = data['password']

        # Găsește utilizatorul
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401

        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Creează token
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Login failed: ' + str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to get profile: ' + str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        # Update name
        if 'name' in data:
            name = data['name'].strip()
            if len(name) >= 2:
                user.name = name
            else:
                return jsonify({'error': 'Name must be at least 2 characters'}), 400

        # Update email
        if 'email' in data:
            email = data['email'].strip().lower()
            if validate_email(email):
                # Verifică dacă email-ul nu e deja folosit
                existing_user = User.query.filter_by(email=email).first()
                if existing_user and existing_user.id != user.id:
                    return jsonify({'error': 'Email already in use'}), 400
                user.email = email
            else:
                return jsonify({'error': 'Invalid email format'}), 400

        # Update password
        if 'password' in data:
            password = data['password']
            if validate_password(password):
                user.password = password
            else:
                return jsonify({'error': 'Password must be at least 6 characters'}), 400

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile: ' + str(e)}), 500

# Alert routes
@main_bp.route('/alerts', methods=['POST'])
@jwt_required()
def create_alert():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if user.role != 'user':
            return jsonify({'error': 'Only users can create alerts'}), 403
        
        data = request.get_json()
        
        # Validare input
        required_fields = ['title', 'description', 'type', 'latitude', 'longitude']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': f'Missing required fields: {", ".join(required_fields)}'}), 400
        
        title = data['title'].strip()
        description = data['description'].strip()
        alert_type = data['type']
        latitude = data['latitude']
        longitude = data['longitude']
        accuracy = data.get('accuracy', 0)
        
        # Validări
        if len(title) < 3 or len(title) > 100:
            return jsonify({'error': 'Title must be between 3 and 100 characters'}), 400
            
        if len(description) < 10 or len(description) > 500:
            return jsonify({'error': 'Description must be between 10 and 500 characters'}), 400
            
        valid_types = ['deforestation', 'fire', 'pollution', 'wildlife', 'other']
        if alert_type not in valid_types:
            return jsonify({'error': f'Invalid alert type. Must be one of: {", ".join(valid_types)}'}), 400
            
        if not validate_coordinates(latitude, longitude):
            return jsonify({'error': 'Invalid coordinates'}), 400
        
        # Creează alerta
        alert = Alert(
            title=title,
            description=description,
            type=alert_type,
            latitude=float(latitude),
            longitude=float(longitude),
            accuracy=float(accuracy) if accuracy else 0,
            user_id=user_id,
            status='pending'
        )
        
        db.session.add(alert)
        db.session.commit()
        
        return jsonify({
            'message': 'Alert created successfully',
            'alert': alert.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create alert: ' + str(e)}), 500

@main_bp.route('/alerts', methods=['GET'])
def get_alerts():
    try:
        # Parametri opționali pentru filtrare
        status = request.args.get('status')
        alert_type = request.args.get('type')
        limit = request.args.get('limit', 50, type=int)
        
        query = Alert.query
        
        if status:
            query = query.filter_by(status=status)
        if alert_type:
            query = query.filter_by(type=alert_type)
            
        alerts = query.order_by(Alert.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'alerts': [alert.to_dict() for alert in alerts]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get alerts: ' + str(e)}), 500

@main_bp.route('/alerts/<int:alert_id>', methods=['GET'])
def get_alert(alert_id):
    try:
        alert = Alert.query.get(alert_id)
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
            
        return jsonify({'alert': alert.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get alert: ' + str(e)}), 500

@main_bp.route('/alerts/<int:alert_id>', methods=['PUT'])
@jwt_required()
def update_alert_status(alert_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        alert = Alert.query.get(alert_id)
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        data = request.get_json()
        
        if 'status' in data:
            valid_statuses = ['pending', 'investigating', 'resolved', 'rejected', 'solved']
            if data['status'] in valid_statuses:
                alert.status = data['status']
                alert.updated_at = datetime.utcnow()
            else:
                return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
        
        db.session.commit()
        
        return jsonify({
            'message': 'Alert updated successfully',
            'alert': alert.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update alert: ' + str(e)}), 500

@main_bp.route('/alerts/user', methods=['GET'])
@jwt_required()
def get_user_alerts():
    try:
        user_id = int(get_jwt_identity())
        
        alerts = Alert.query.filter_by(user_id=user_id).order_by(Alert.created_at.desc()).all()
        
        return jsonify({
            'alerts': [alert.to_dict() for alert in alerts]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user alerts: ' + str(e)}), 500

@main_bp.route('/alerts/<int:alert_id>/dismiss', methods=['PUT'])
@jwt_required()
def dismiss_alert(alert_id):
    try:
        user_id = int(get_jwt_identity())
        
        alert = Alert.query.get(alert_id)
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        # Users can only dismiss their own alerts
        if alert.user_id != user_id:
            return jsonify({'error': 'You can only dismiss your own alerts'}), 403
        
        # Mark alert as solved
        alert.status = 'solved'
        alert.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Alert marked as solved',
            'alert': alert.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to dismiss alert: ' + str(e)}), 500

# Admin routes
@main_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(int(user_id))
        
        if not current_user or not current_user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        users = User.query.all()
        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get users: ' + str(e)}), 500

@main_bp.route('/admin/alerts', methods=['GET'])
@jwt_required()
def admin_get_alerts():
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(int(user_id))
        
        if not current_user or not current_user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        alerts = Alert.query.order_by(Alert.created_at.desc()).all()
        
        return jsonify({
            'alerts': [alert.to_dict() for alert in alerts]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get alerts: ' + str(e)}), 500

@auth_bp.route('/upgrade-to-admin', methods=['POST'])
@jwt_required()
def upgrade_to_admin():
    try:
        data = request.get_json()
        if not data or 'pin' not in data:
            return jsonify({'error': 'PIN code required'}), 400

        pin = data['pin'].strip()
        # Secret admin PIN - you can change this
        ADMIN_PIN = "TREE2025"
        
        if pin != ADMIN_PIN:
            return jsonify({'error': 'Invalid PIN code'}), 401
        
        user_id = get_jwt_identity()
        current_user = User.query.get(int(user_id))
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if current_user.is_admin():
            return jsonify({'message': 'User is already an admin'}), 200
        
        # Upgrade user to admin
        current_user.role = 'admin'
        db.session.commit()
        
        # Create new token with admin privileges
        new_token = create_access_token(identity=str(current_user.id))
        
        return jsonify({
            'message': 'Successfully upgraded to admin!',
            'access_token': new_token,
            'user': current_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to upgrade: ' + str(e)}), 500

# General routes
@main_bp.route('/test')
def test():
    return {'message': 'Backend connected successfully!'}

@main_bp.route('/protected')
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    return jsonify({
        'message': f'Hello {user.name}! This is a protected route.',
        'user_role': user.role
    }), 200