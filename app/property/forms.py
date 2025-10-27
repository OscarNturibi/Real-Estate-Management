#!/usr/bin/python3
"""Forms for the property application"""

from flask_wtf import FlaskForm
from wtforms import (
    StringField, IntegerField, TextAreaField, SelectField,
    DateField, FileField, SubmitField
)
from wtforms.validators import DataRequired, Length, NumberRange, Optional
from flask_wtf.file import FileAllowed


class PropertyForm(FlaskForm):
    """Form for creating a new property."""

    title = StringField(
        'Title',
        validators=[DataRequired(), Length(min=4, max=200)]
    )
    description = TextAreaField(
        'Description',
        validators=[DataRequired(), Length(min=10)]
    )
    price = IntegerField(
        'Price',
        validators=[DataRequired(), NumberRange(min=0)]
    )
    location = StringField(
        'Location',
        validators=[DataRequired(), Length(min=2, max=200)]
    )
    property_type = SelectField(
        'Property Type',
        choices=[('House', 'House'), ('Apartment', 'Apartment'), ('Condo', 'Condo')],
        validators=[DataRequired()]
    )
    property_status = SelectField(
        'Property Status',
        choices=[('For Sale', 'For Sale'), ('For Rent', 'For Rent')],
        validators=[DataRequired()]
    )
    bedrooms = IntegerField(
        'Number of Bedrooms',
        validators=[DataRequired(), NumberRange(min=1)]
    )
    bathrooms = IntegerField(
        'Number of Bathrooms',
        validators=[DataRequired(), NumberRange(min=1)]
    )
    size = IntegerField(
        'Size (sq ft)',
        validators=[DataRequired(), NumberRange(min=0)]
    )
    available_from = DateField(
        'Available From',
        format='%Y-%m-%d',
        validators=[DataRequired()]
    )
    image1 = FileField(
        'Image 1',
        validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')]
    )
    image2 = FileField(
        'Image 2',
        validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')]
    )
    image3 = FileField(
        'Image 3',
        validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')]
    )
    submit = SubmitField('Create Property')


class UpdatePropertyForm(FlaskForm):
    """Form for updating an existing property."""

    title = StringField('Title', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    price = IntegerField('Price', validators=[DataRequired()])
    location = StringField('Location', validators=[DataRequired()])
    property_type = SelectField(
        'Property Type',
        choices=[('House', 'House'), ('Apartment', 'Apartment'), ('Condo', 'Condo')],
        validators=[DataRequired()]
    )
    property_status = SelectField(
        'Property Status',
        choices=[('For Sale', 'For Sale'), ('For Rent', 'For Rent')],
        validators=[DataRequired()]
    )
    bedrooms = IntegerField('Bedrooms', validators=[DataRequired()])
    bathrooms = IntegerField('Bathrooms', validators=[DataRequired()])
    size = IntegerField('Size (sqft)', validators=[DataRequired()])
    available_from = DateField('Available From', format='%Y-%m-%d', validators=[Optional()])
    thumbnail1 = FileField('Thumbnail 1', validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])
    thumbnail2 = FileField('Thumbnail 2', validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])
    thumbnail3 = FileField('Thumbnail 3', validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])
    submit = SubmitField('Update')


class SearchForm(FlaskForm):
    """Form for searching properties."""

    location = StringField('Location', validators=[Optional()])
    min_price = IntegerField('Min Price $', validators=[Optional(), NumberRange(min=0)])
    max_price = IntegerField('Max Price $', validators=[Optional(), NumberRange(min=0)])
    property_type = SelectField(
        'Property Type',
        choices=[('House', 'House'), ('Apartment', 'Apartment')],
        validators=[Optional()]
    )
    property_status = SelectField(
        'Property Status',
        choices=[('For Sale', 'For Sale'), ('For Rent', 'For Rent')],
        validators=[Optional()]
    )
    min_bedrooms = IntegerField('Min Bedrooms', validators=[Optional(), NumberRange(min=0)])
    min_bathrooms = IntegerField('Min Bathrooms', validators=[Optional(), NumberRange(min=0)])
    submit = SubmitField('Search')
