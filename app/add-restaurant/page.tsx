'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToastStore } from '@/store/useToastStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Upload, X, Edit2, Trash2, Check } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  name: string;
  price: number;
  category?: 'drink' | 'food';
}

type Step = 'name' | 'upload' | 'review' | 'confirming';

export default function AddRestaurantPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: showError, success: showSuccess } = useToastStore();
  const [step, setStep] = useState<Step>('name');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedMenuItems, setExtractedMenuItems] = useState<MenuItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'category'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  function validateAndSetImage(file: File) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('Please upload a JPEG, PNG, or WEBP image');
      return false;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      showError('Image size must be less than 20MB');
      return false;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return true;
  }

  function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    validateAndSetImage(file);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  }

  async function handleAnalyzeMenu() {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      const result = await api.analyzeMenuImage(selectedImage);
      setExtractedMenuItems(result.menuItems);
      setStep('review');
    } catch (error: any) {
      console.error('Analyze menu error:', error);
      const errorMessage = error.message || 'Failed to analyze menu image. Please try again.';
      showError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleEditItem(index: number) {
    setEditingIndex(index);
  }

  function handleSaveEdit(index: number, name: string, price: number, category?: 'drink' | 'food') {
    const updated = [...extractedMenuItems];
    updated[index] = { name: name.trim(), price, category: category || 'food' };
    setExtractedMenuItems(updated);
    setEditingIndex(null);
  }

  function handleDeleteItem(index: number) {
    const updated = extractedMenuItems.filter((_, i) => i !== index);
    setExtractedMenuItems(updated);
  }

  function handleAddItem() {
    setExtractedMenuItems([...extractedMenuItems, { name: '', price: 0, category: 'food' }]);
    setEditingIndex(extractedMenuItems.length);
  }

  function getSortedMenuItems() {
    const sorted = [...extractedMenuItems];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        const categoryOrder = { 'drink': 1, 'food': 2 };
        const aCat = categoryOrder[a.category || 'food'] || 2;
        const bCat = categoryOrder[b.category || 'food'] || 2;
        comparison = aCat - bCat;
        // If same category, sort by price
        if (comparison === 0) {
          comparison = a.price - b.price;
        }
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }

  function getCategoryLabel(category?: string) {
    switch (category) {
      case 'drink': return 'መጠጥ';
      default: return 'ምግብ';
    }
  }

  function getCategoryColor(category?: string) {
    switch (category) {
      case 'drink': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  }

  async function handleConfirmAndSave() {
    if (!restaurantName.trim()) {
      showError('Please enter a restaurant name');
      return;
    }

    if (extractedMenuItems.length === 0) {
      showError('Please add at least one menu item');
      return;
    }

    // Validate all items have names
    const invalidItems = extractedMenuItems.filter((item) => !item.name.trim() || item.price <= 0);
    if (invalidItems.length > 0) {
      showError('Please ensure all menu items have a name and valid price');
      return;
    }

    try {
      setIsSaving(true);
      setStep('confirming');

      // Create restaurant
      const restaurant = await api.createRestaurant({
        name: restaurantName.trim(),
        location: restaurantLocation.trim() || undefined,
      });

      // Create menu items
      await api.createMenuItems(restaurant.restaurant.id, extractedMenuItems);

      // Redirect to create meal page with the new restaurant selected
      router.push(`/create?restaurantId=${restaurant.restaurant.id}`);
    } catch (error: any) {
      showError(error.message || 'Failed to save restaurant');
      setStep('review');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-32 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/create"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft size={18} />
          <span className="font-medium text-sm">Back</span>
        </Link>
        <h1 className="text-base font-bold text-foreground">Add Restaurant</h1>
        <div className="w-16"></div>
      </div>

      <div className="space-y-6">
        {/* Step 1: Restaurant Name */}
        {step === 'name' && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
              Restaurant Information
            </h2>
            <GlassCard className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-foreground">Restaurant Name *</label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Enter restaurant name"
                    className="w-full h-8 bg-background rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-foreground">Location (optional)</label>
                  <input
                    type="text"
                    value={restaurantLocation}
                    onChange={(e) => setRestaurantLocation(e.target.value)}
                    placeholder="Enter location"
                    className="w-full h-8 bg-background rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <GlassButton
                  onClick={() => {
                    if (!restaurantName.trim()) {
                      showError('Please enter a restaurant name');
                      return;
                    }
                    setStep('upload');
                  }}
                  className="w-full rounded bg-primary py-2 text-sm font-bold text-primary-foreground"
                >
                  Next: Upload Menu
                </GlassButton>
              </div>
            </GlassCard>
          </section>
        )}

        {/* Step 2: Upload Menu Image */}
        {step === 'upload' && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
              Upload Menu Image
            </h2>
            <GlassCard className="p-3">
              <div className="space-y-3">
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Upload size={32} className={`mx-auto mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground">JPEG, PNG, or WEBP (max 20MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Menu preview"
                        className="w-full rounded-lg border border-border"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-background/90 backdrop-blur-sm rounded-full text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <GlassButton
                        variant="secondary"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="flex-1 rounded py-2 text-sm font-bold"
                      >
                        Change Image
                      </GlassButton>
                      <GlassButton
                        onClick={handleAnalyzeMenu}
                        disabled={isAnalyzing}
                        className="flex-1 rounded bg-primary py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                          </div>
                        ) : (
                          'Analyze Menu'
                        )}
                      </GlassButton>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setStep('name')}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
              </div>
            </GlassCard>
          </section>
        )}

        {/* Step 3: Review Menu Items */}
        {step === 'review' && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
              Review Menu Items
            </h2>
            <GlassCard className="p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {extractedMenuItems.length} item{extractedMenuItems.length !== 1 ? 's' : ''} found
                  </p>
                  <button
                    onClick={handleAddItem}
                    className="text-xs text-primary font-medium hover:text-primary/80"
                  >
                    + Add Item
                  </button>
                </div>
                
                {/* Sort Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'category')}
                    className="text-xs bg-background border border-border rounded px-2 py-1 text-foreground"
                  >
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="text-xs bg-background border border-border rounded px-2 py-1 text-foreground hover:bg-muted"
                  >
                    {sortOrder === 'asc' ? '↑ Low to High' : '↓ High to Low'}
                  </button>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getSortedMenuItems().map((item, index) => {
                    const originalIndex = extractedMenuItems.indexOf(item);
                    return (
                    <div
                      key={index}
                      className="bg-background rounded border border-border p-2"
                    >
                      {editingIndex === originalIndex ? (
                        <EditItemForm
                          item={item}
                          onSave={(name, price, category) => handleSaveEdit(originalIndex, name, price, category)}
                          onCancel={() => setEditingIndex(null)}
                        />
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(item.category)}`}>
                                {getCategoryLabel(item.category)}
                              </span>
                            </div>
                            <p className="text-xs text-primary font-medium">{item.price} Birr</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditItem(originalIndex)}
                              className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(originalIndex)}
                              className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
                <div className="flex gap-2 pt-2">
                  <GlassButton
                    variant="secondary"
                    onClick={() => {
                      setStep('upload');
                      setExtractedMenuItems([]);
                    }}
                    className="flex-1 rounded py-2 text-sm font-bold"
                  >
                    ← Back
                  </GlassButton>
                  <GlassButton
                    onClick={handleConfirmAndSave}
                    disabled={isSaving || extractedMenuItems.length === 0}
                    className="flex-1 rounded bg-primary py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Confirm & Save'
                    )}
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </section>
        )}

        {/* Step 4: Confirming */}
        {step === 'confirming' && (
          <GlassCard className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-foreground">Saving restaurant and menu...</p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function EditItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: MenuItem;
  onSave: (name: string, price: number, category?: 'drink' | 'food') => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [category, setCategory] = useState<'drink' | 'food'>(item.category || 'food');

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
        className="w-full h-8 bg-background rounded px-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="flex-1 h-8 bg-background rounded px-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <span className="text-xs text-muted-foreground">Birr</span>
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as 'drink' | 'food')}
        className="w-full h-8 bg-background rounded px-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="food">ምግብ</option>
        <option value="drink">መጠጥ</option>
      </select>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSave(name, parseFloat(price) || 0, category)}
          className="flex-1 p-1.5 bg-primary text-primary-foreground rounded text-sm font-medium"
        >
          <Check size={14} className="inline mr-1" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 bg-muted text-foreground rounded"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

