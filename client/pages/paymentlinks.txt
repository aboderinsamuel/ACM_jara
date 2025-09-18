import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ImageUpload } from '../components/ui/ImageUpload';
import { useCreator } from '../hooks/useCreator';
import { api, PaymentLink } from '../lib/api';
import {
  Plus,
  CreditCard,
  Users,
  Eye,
  Calendar,
  Package,
  Heart,
  Ticket,
  Home,
  DollarSign,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  Lock,
  Copy,
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export function Movies() {
  const { creator, isLoading: creatorLoading } = useCreator();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishingLinks, setPublishingLinks] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    type: 'product' as PaymentLink['type'],
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    image_url: '',
    successMessage: '67889jara',
  });

  useEffect(() => {
    if (creator) {
      loadPaymentLinks();
    }
  }, [creator, filter]);

  // Redirect to dashboard if user doesn't have a creator profile
  if (!creatorLoading && !creator) {
    return <Navigate to="/dashboard" replace />;
  }

  const loadPaymentLinks = async () => {
    if (!creator) return;

    try {
      setIsLoading(true);
      const published = filter === 'published' ? true : filter === 'draft' ? false : undefined;

      // Get payment links from API
      const response = await api.getPaymentLinks(creator.id, { published });
      setPaymentLinks(response.paymentLinks || []);
    } catch (error) {
      console.error('Error loading payment links:', error);
      toast.error('Failed to load movies');
      setPaymentLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const linkData = {
        ...formData,
        price: parseFloat(formData.price),
        isPublished: true, // Auto-publish payment links
      };

      if (editingLink) {
        await api.updatePaymentLink(editingLink.id, linkData);
        setPaymentLinks(prev => prev.map(link =>
          link.id === editingLink.id ? { ...link, ...linkData } : link
        ));
        toast.success('Movie updated successfully!');
      } else {
        const response = await api.createPaymentLink(linkData);
        setPaymentLinks(prev => [response.paymentLink, ...prev]);

        // Show the generated link to the user
        const generatedLink = `${window.location.origin}/pay/${response.paymentLink.slug}`;
        toast.success(
          <div>
            <p>Movie added successfully!</p>
            <p className="text-sm mt-1">
              Share this link: <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{generatedLink}</a>
            </p>
          </div>,
          { duration: 10000 }
        );
      }

      resetForm();
    } catch (error) {
      console.error('Error saving payment link:', error);
      toast.error('Failed to save movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'product',
      title: '',
      description: '',
      price: '',
      currency: 'USD',
      image_url: '',
      successMessage: '67889jara',
    });
    setEditingLink(null);
    setShowCreateModal(false);
  };

  const handleEdit = (link: PaymentLink) => {
    setFormData({
      type: link.type,
      title: link.title || '',
      description: link.description || '',
      price: link.price?.toString() || '',
      currency: link.currency || 'USD',
      image_url: link.image_url || '',
      successMessage: '67889jara', // Always use hardcoded token
    });
    setEditingLink(link);
    setShowCreateModal(true);
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
      // await api.deletePaymentLink(linkId);
      setPaymentLinks(prev => prev.filter(link => link.id !== linkId));
      toast.success('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting payment link:', error);
      toast.error('Failed to delete payment link');
    }
  };

  const handleTogglePublish = async (linkId: string, isPublished: boolean) => {
    setPublishingLinks(prev => new Set(prev).add(linkId));

    try {
      await api.publishPaymentLink(linkId, !isPublished);
      setPaymentLinks(prev => prev.map(link =>
        link.id === linkId ? { ...link, isPublished: !isPublished } : link
      ));
      toast.success(`Movie ${!isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Failed to update movie status');
    } finally {
      setPublishingLinks(prev => {
        const newSet = new Set(prev);
        newSet.delete(linkId);
        return newSet;
      });
    }
  };

  const handleCopyLink = async (slug: string) => {
    const link = `${window.location.origin}/pay/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Movie link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Movie link copied to clipboard!');
    }
  };

  const paymentTypeIcons = {
    tip: Heart,
    membership: Users,
    pay_per_view: Eye,
    rental: Calendar,
    ticket: Ticket,
    product: Package,
  };

  const paymentTypeColors = {
    tip: 'text-pink-600 bg-pink-100',
    membership: 'text-purple-600 bg-purple-100',
    pay_per_view: 'text-blue-600 bg-blue-100',
    rental: 'text-green-600 bg-green-100',
    ticket: 'text-orange-600 bg-orange-100',
    product: 'text-indigo-600 bg-indigo-100',
  };

  // Remove client-side filtering since we're doing server-side filtering
  const filteredLinks = paymentLinks;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Movies</h1>
            <p className="text-gray-600">
              Create and manage your movies for rental
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Movie
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'all', label: 'All Links' },
              { id: 'published', label: 'Published' },
              { id: 'draft', label: 'Drafts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Links Grid */}
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.map((link) => {
              const Icon = paymentTypeIcons[link.type];
              const colorClasses = paymentTypeColors[link.type];

              return (
                <Card key={link.id} hover className="group">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 overflow-hidden relative">
                    {link.image_url ? (
                      <img
                        src={link.image_url}
                        alt={link.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-sm text-purple-600 font-medium">{link.title}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          link.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {link.isPublished ? (
                          <>
                            <Globe className="w-3 h-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {link.type.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                            onClick={() => handleEdit(link)}
                            leftIcon={<Edit className="w-4 h-4" />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                            onClick={() => handleCopyLink(link.slug)}
                            leftIcon={<Copy className="w-4 h-4" />}
                          >
                            Copy
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white text-gray-900 hover:bg-gray-100"
                          onClick={() => window.open(`/pay/${link.slug}`, '_blank')}
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          Preview
                        </Button>
                        {link.isPublished && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                            onClick={() => window.open(`/pay/${link.slug}`, '_blank')}
                            leftIcon={<ExternalLink className="w-4 h-4" />}
                          >
                            View Live
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {link.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900">
                          ${link.price} {link.currency}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>${link.totalRevenue} earned</div>
                        <div>{link.totalTransactions} transactions</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(link.id, link.isPublished)}
                        disabled={publishingLinks.has(link.id)}
                        leftIcon={
                          publishingLinks.has(link.id) ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : link.isPublished ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Globe className="w-4 h-4" />
                          )
                        }
                      >
                        {publishingLinks.has(link.id) ? 'Updating...' : link.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'published' ? 'No published movies' : filter === 'draft' ? 'No draft movies' : 'No movies yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'published'
                ? 'Publish your first movie to start sharing.'
                : filter === 'draft'
                ? 'Add a new movie or check your published movies.'
                : 'Add your first movie to start sharing your work.'}
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Your First Movie
            </Button>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={resetForm}
          title={editingLink ? 'Edit Movie' : 'Add Movie'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
              </div>
            </div>

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter movie title"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                placeholder="Describe your movie and what viewers will experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                placeholder="Add a movie poster or cover image"
                folder="payment-links"
              />
            </div>


            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const previewUrl = editingLink
                    ? `/pay/${editingLink.slug}`
                    : `/pay/preview?${new URLSearchParams({
                        title: formData.title,
                        description: formData.description,
                        price: formData.price,
                        currency: formData.currency,
                        imageUrl: formData.image_url,
                        successMessage: formData.successMessage,
                        type: formData.type
                      }).toString()}`;
                  window.open(previewUrl, '_blank');
                }}
                disabled={isSubmitting}
              >
                Preview
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {editingLink ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingLink ? 'Update Movie' : 'Create Movie'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}