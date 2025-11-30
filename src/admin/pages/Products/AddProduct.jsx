import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload, Plus, Minus } from 'lucide-react';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        ingredients: '',
        eggType: 'egg',
        stockQuantity: '',
        basePrice: '',
        status: 'active',
        images: [],
    });

    const [variants, setVariants] = useState([
        { weight: '0.5', price: '' },
        { weight: '1', price: '' },
        { weight: '1.5', price: '' },
        { weight: '2', price: '' },
    ]);

    const [addOns, setAddOns] = useState([
        { name: 'Rose', price: '50', selected: false },
        { name: 'Teddy Bear', price: '200', selected: false },
        { name: 'Chocolates', price: '150', selected: false },
    ]);

    const categories = ['Birthday', 'Anniversary', 'Kids', 'Love', 'Wedding', 'Corporate'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleAddOnChange = (index, field, value) => {
        const newAddOns = [...addOns];
        if (field === 'selected') {
            newAddOns[index][field] = !newAddOns[index][field];
        } else {
            newAddOns[index][field] = value;
        }
        setAddOns(newAddOns);
    };

    const addNewAddOn = () => {
        setAddOns([...addOns, { name: '', price: '', selected: false }]);
    };

    const removeAddOn = (index) => {
        const newAddOns = addOns.filter((_, i) => i !== index);
        setAddOns(newAddOns);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Product Data:', { ...formData, variants, addOns });
        // Here you would typically send data to backend
        alert('Product added successfully!');
        navigate('/admin/products');
    };

    return (
        <div className="add-product">
            <div className="page-header">
                <h1>Add New Cake</h1>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => navigate('/admin/products')}>
                        <X size={18} />
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSubmit}>
                        <Save size={18} />
                        Save Product
                    </button>
                </div>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Basic Information */}
                    <div className="form-section">
                        <h3 className="section-title">Basic Information</h3>

                        <div className="form-group">
                            <label htmlFor="name">Cake Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Red Velvet Dream"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat.toLowerCase()}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Cake Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your delicious cake..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ingredients">Ingredients</label>
                            <textarea
                                id="ingredients"
                                name="ingredients"
                                value={formData.ingredients}
                                onChange={handleInputChange}
                                placeholder="List all ingredients..."
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Egg Type</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="eggType"
                                        value="egg"
                                        checked={formData.eggType === 'egg'}
                                        onChange={handleInputChange}
                                    />
                                    <span>With Egg</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="eggType"
                                        value="eggless"
                                        checked={formData.eggType === 'eggless'}
                                        onChange={handleInputChange}
                                    />
                                    <span>Eggless</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Variants */}
                    <div className="form-section">
                        <h3 className="section-title">Pricing & Variants</h3>

                        <div className="form-group">
                            <label htmlFor="basePrice">Base Price (0.5 Kg) *</label>
                            <input
                                type="number"
                                id="basePrice"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleInputChange}
                                placeholder="₹"
                                required
                            />
                        </div>

                        <div className="variants-section">
                            <label>Weight Variants & Prices *</label>
                            <div className="variants-grid">
                                {variants.map((variant, index) => (
                                    <div key={index} className="variant-item">
                                        <span className="variant-weight">{variant.weight} Kg</span>
                                        <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                            placeholder="₹ Price"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="stockQuantity">Stock Quantity *</label>
                            <input
                                type="number"
                                id="stockQuantity"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                placeholder="Available units"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={formData.status === 'active'}
                                        onChange={handleInputChange}
                                    />
                                    <span className="status-badge active">Active</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        checked={formData.status === 'inactive'}
                                        onChange={handleInputChange}
                                    />
                                    <span className="status-badge inactive">Inactive</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add-ons Section */}
                <div className="form-section full-width">
                    <div className="section-header">
                        <h3 className="section-title">Add-ons</h3>
                        <button type="button" className="btn-add-small" onClick={addNewAddOn}>
                            <Plus size={16} />
                            Add New
                        </button>
                    </div>

                    <div className="addons-grid">
                        {addOns.map((addon, index) => (
                            <div key={index} className="addon-item">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={addon.selected}
                                        onChange={() => handleAddOnChange(index, 'selected', null)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                                <input
                                    type="text"
                                    value={addon.name}
                                    onChange={(e) => handleAddOnChange(index, 'name', e.target.value)}
                                    placeholder="Add-on name"
                                    className="addon-name"
                                />
                                <input
                                    type="number"
                                    value={addon.price}
                                    onChange={(e) => handleAddOnChange(index, 'price', e.target.value)}
                                    placeholder="₹ Price"
                                    className="addon-price"
                                />
                                {addOns.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => removeAddOn(index)}
                                    >
                                        <Minus size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="form-section full-width">
                    <h3 className="section-title">Product Images</h3>

                    <div className="image-upload-section">
                        <label htmlFor="images" className="upload-area">
                            <Upload size={32} />
                            <p>Click to upload images</p>
                            <span>PNG, JPG up to 5MB</span>
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </label>

                        {formData.images.length > 0 && (
                            <div className="image-preview-grid">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={img} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
