from setuptools import setup, find_packages
import sys, os

version = 'pre-alpha'

setup(name='mevoco_ui',
      version=version,
      description="zstack ui",
      long_description="""\
zstack""",
      classifiers=[], # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
      keywords='zstack',
      author='Frank Zhang',
      author_email='xing5820@gmail.com',
      url='',
      license='',
      packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
      include_package_data=True,
      package_data={'':['zstack_dashboard/static/*']},
      zip_safe=True,
      install_requires=[
          # -*- Extra requirements: -*-
          "Flask",
          "kombu",
          "librabbitmq",
          "argparse",
          "Flask-Script",
          "simplejson",
          "flask-socketio"
      ],
      entry_points="""
      # -*- Entry points: -*-
      """,
      data_files=[('/etc/init.d', ['zstack-dashboard'])]
      )
