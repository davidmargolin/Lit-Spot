from rest_api import app
import sys


if __name__ == '__main__':
    sys.setdefaultencoding('utf-8')
    app.run(port=5000, debug=True)