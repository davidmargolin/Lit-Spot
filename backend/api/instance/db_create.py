import sys
import os
from sqlalchemy.schema import DropTable
from sqlalchemy.ext.compiler import compiles



#### add current path to system path ####
cur_abs_path = os.path.abspath(os.curdir)
if  cur_abs_path not in sys.path:
    print('...missing directory in PYTHONPATH... added!')
    sys.path.append(cur_abs_path)

#### drop all existing tables and create new from models ####
from rest_api import db # noqa

@compiles(DropTable, "postgresql")
def _compile_drop_table(element, compiler, **kwargs):
    return compiler.visit_drop_table(element) + " CASCADE"

db.drop_all()
# from rest_api.models.video import VideoModel # noqa
# from rest_api.models.user import UserModel # noqa
from rest_api.models.fire import FireModel # noqa
db.create_all()

#### init db with essential data ####

# create first user as admin
# admin = UserModel(role='admin', 
#             username='admin',
#             password_hash= generate_password_hash('admin_password'),
#             email='admin@youcmt.com',
#             profile_img='default.jpg')
# admin.save_to_db()
# print('...admin created')

# # create second user as guest
# guest = UserModel(role='guest', 
#             username='guest',
#             password_hash= generate_password_hash('guest_password'),
#             email='guest@youcmt.com',
#             profile_img='default.jpg')
# guest.save_to_db()
# print ('...guest created')


print('...all done!')