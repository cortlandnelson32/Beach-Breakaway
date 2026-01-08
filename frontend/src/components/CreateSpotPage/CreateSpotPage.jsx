import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postSpotThunk } from "../../store/spots";
import { postSpotImageThunk } from "../../store/spot-image";
import './CreateSpotPage.css';

function CreateSpot() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    description: '',
    price: '',
    name: '',
  });

  const [images, setImages] = useState({
    previewPicture: '',
    picture1: '',
    picture2: '',
    picture3: '',
    picture4: ''
  });

  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Generic input handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleImageChange = useCallback((field, value) => {
    setImages(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Comprehensive validation
  useEffect(() => {
    const newErrors = {};

    // Location validations
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    if (!formData.address) {
      newErrors.address = 'Street address is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    // Description validation
    if (formData.description.length < 30) {
      newErrors.description = 'Description must be at least 30 characters';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Price validation
    const priceNum = parseFloat(formData.price);
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Price must be greater than $0';
    } else if (priceNum > 10000) {
      newErrors.price = 'Price must be less than $10,000';
    }

    // Image URL validations
    const imageFields = ['previewPicture', 'picture1', 'picture2', 'picture3', 'picture4'];
    imageFields.forEach(field => {
      const url = images[field];
      if (url) {
        const validExtensions = ['.png', '.jpg', '.jpeg'];
        const hasValidExtension = validExtensions.some(ext => 
          url.toLowerCase().endsWith(ext)
        );
        if (!hasValidExtension) {
          newErrors[field] = 'Image URL must end in .png, .jpg, or .jpeg';
        }
      }
    });

    if (!images.previewPicture) {
      newErrors.previewPicture = 'Preview image is required';
    }

    setErrors(newErrors);
  }, [formData, images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);

    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    const spotData = {
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      lat: 37.7645358, // Default coordinates
      lng: -122.4730327,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
    };

    try {
      const newSpot = await dispatch(postSpotThunk(spotData));

      // Upload images sequentially
      const imageData = [
        { url: images.previewPicture, preview: true },
        { url: images.picture1, preview: false },
        { url: images.picture2, preview: false },
        { url: images.picture3, preview: false },
        { url: images.picture4, preview: false }
      ];

      for (const image of imageData) {
        if (image.url.trim()) {
          await dispatch(postSpotImageThunk(image, newSpot.id));
        }
      }

      navigate(`/spots/${newSpot.id}`);
    } catch (error) {
      console.error('Error creating spot:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create spot. Please try again.'
      }));
      setIsSubmitting(false);
    }
  };

  const shouldShowError = (field) => {
    return showErrors || touched[field];
  };

  return (
    <div className='create-spot-container'>
      <form className='create-spot-form' onSubmit={handleSubmit}>
        <header className='form-header'>
          <h1>Create a New Spot</h1>
          <p className='form-subtitle'>Share your beach paradise with travelers</p>
        </header>

        {errors.submit && (
          <div className="error-banner" role="alert">
            {errors.submit}
          </div>
        )}

        {/* Location Section */}
        <section className='form-section'>
          <h2>Where&apos;s your place located?</h2>
          <p className='section-description'>
            Guests will only get your exact address once they book a reservation.
          </p>

          <div className='input-group'>
            <label htmlFor='country' className='input-label'>
              Country {shouldShowError('country') && errors.country && <span className='error-inline'>• {errors.country}</span>}
            </label>
            <input
              id='country'
              type="text"
              className={`form-input ${shouldShowError('country') && errors.country ? 'input-error' : ''}`}
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder='Country'
              disabled={isSubmitting}
            />
          </div>

          <div className='input-group'>
            <label htmlFor='address' className='input-label'>
              Street Address {shouldShowError('address') && errors.address && <span className='error-inline'>• {errors.address}</span>}
            </label>
            <input
              id='address'
              type="text"
              className={`form-input ${shouldShowError('address') && errors.address ? 'input-error' : ''}`}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder='Street Address'
              disabled={isSubmitting}
            />
          </div>

          <div className='input-row'>
            <div className='input-group flex-1'>
              <label htmlFor='city' className='input-label'>
                City {shouldShowError('city') && errors.city && <span className='error-inline'>• {errors.city}</span>}
              </label>
              <input
                id='city'
                type="text"
                className={`form-input ${shouldShowError('city') && errors.city ? 'input-error' : ''}`}
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder='City'
                disabled={isSubmitting}
              />
            </div>

            <span className='comma'>,</span>

            <div className='input-group flex-1'>
              <label htmlFor='state' className='input-label'>
                State {shouldShowError('state') && errors.state && <span className='error-inline'>• {errors.state}</span>}
              </label>
              <input
                id='state'
                type="text"
                className={`form-input ${shouldShowError('state') && errors.state ? 'input-error' : ''}`}
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder='STATE'
                disabled={isSubmitting}
              />
            </div>
          </div>
        </section>

        <div className='divider'></div>

        {/* Description Section */}
        <section className='form-section'>
          <h2>Describe your place to guests</h2>
          <p className='section-description'>
            Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
          </p>

          <div className='input-group'>
            <label htmlFor='description' className='input-label'>
              Description {shouldShowError('description') && errors.description && <span className='error-inline'>• {errors.description}</span>}
            </label>
            <textarea
              id='description'
              className={`form-textarea ${shouldShowError('description') && errors.description ? 'input-error' : ''}`}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder='Please write at least 30 characters'
              disabled={isSubmitting}
              rows={5}
            />
            <span className='char-count'>{formData.description.length} / 30 minimum</span>
          </div>
        </section>

        <div className='divider'></div>

        {/* Name Section */}
        <section className='form-section'>
          <h2>Create a title for your spot</h2>
          <p className='section-description'>
            Catch guests&apos; attention with a spot title that highlights what makes your place special.
          </p>

          <div className='input-group'>
            <label htmlFor='name' className='input-label'>
              Name {shouldShowError('name') && errors.name && <span className='error-inline'>• {errors.name}</span>}
            </label>
            <input
              id='name'
              type="text"
              className={`form-input ${shouldShowError('name') && errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder='Name of your spot'
              disabled={isSubmitting}
            />
          </div>
        </section>

        <div className='divider'></div>

        {/* Price Section */}
        <section className='form-section'>
          <h2>Set a base price for your spot</h2>
          <p className='section-description'>
            Competitive pricing can help your listing stand out and rank higher in search results.
          </p>

          <div className='input-group'>
            <label htmlFor='price' className='input-label'>
              Price per night (USD) {shouldShowError('price') && errors.price && <span className='error-inline'>• {errors.price}</span>}
            </label>
            <div className='price-input-wrapper'>
              <span className='currency-symbol'>$</span>
              <input
                id='price'
                type="number"
                className={`form-input price-input ${shouldShowError('price') && errors.price ? 'input-error' : ''}`}
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder='Price per night'
                min="0"
                step="1"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </section>

        <div className='divider'></div>

        {/* Photos Section */}
        <section className='form-section'>
          <h2>Liven up your spot with photos</h2>
          <p className='section-description'>
            Submit a link to at least one photo to publish your spot.
          </p>

          <div className='images-group'>
            {['previewPicture', 'picture1', 'picture2', 'picture3', 'picture4'].map((field, index) => (
              <div key={field} className='input-group'>
                <label htmlFor={field} className='input-label'>
                  {index === 0 ? 'Preview Image URL' : `Image URL ${index}`}
                  {index === 0 && ' (Required)'}
                  {shouldShowError(field) && errors[field] && <span className='error-inline'>• {errors[field]}</span>}
                </label>
                <input
                  id={field}
                  type="url"
                  className={`form-input ${shouldShowError(field) && errors[field] ? 'input-error' : ''}`}
                  value={images[field]}
                  onChange={(e) => handleImageChange(field, e.target.value)}
                  placeholder={index === 0 ? 'Preview Image URL' : 'Image URL'}
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>
        </section>

        <div className='divider'></div>

        <div className='button-container'>
          <button
            type='submit'
            className='submit-button'
            disabled={isSubmitting || (showErrors && Object.keys(errors).length > 0)}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating Spot...
              </>
            ) : (
              'Create Spot'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpot;
