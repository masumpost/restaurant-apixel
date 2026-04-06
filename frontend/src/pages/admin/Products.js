import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categories = ['Biryani', 'Rice', 'BBQ', 'Curry', 'Drinks', 'Desserts'];

const emptyProduct = {
  name_en: '',
  name_bn: '',
  category: 'Biryani',
  description: '',
  price: '',
  image_url: '',
  in_stock: true
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`, { withCredentials: true });
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_bn: product.name_bn,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      in_stock: product.in_stock
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_en || !formData.name_bn || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, payload, { withCredentials: true });
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/products`, payload, { withCredentials: true });
        toast.success('Product created successfully');
      }
      
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`, { withCredentials: true });
      toast.success('Product deleted successfully');
      setDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const toggleStock = async (product) => {
    try {
      await axios.patch(`${API}/products/${product.id}/stock`, {}, { withCredentials: true });
      fetchProducts();
      toast.success(`Product marked as ${product.in_stock ? 'out of stock' : 'in stock'}`);
    } catch (error) {
      toast.error('Failed to update stock status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Products Manager</h1>
          <p className="text-cream/60">Manage your menu items</p>
        </div>
        <Button
          onClick={openAddModal}
          data-testid="add-product-btn"
          className="bg-primary text-background hover:bg-primary-hover"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="bg-surface/40 border-primary/20">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/60">No products found. Add your first product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-cream/70">Image</TableHead>
                    <TableHead className="text-cream/70">Name</TableHead>
                    <TableHead className="text-cream/70">Category</TableHead>
                    <TableHead className="text-cream/70">Price</TableHead>
                    <TableHead className="text-cream/70">Stock</TableHead>
                    <TableHead className="text-cream/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="border-primary/20">
                      <TableCell>
                        <img
                          src={product.image_url}
                          alt={product.name_en}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <p className="text-cream font-medium">{product.name_en}</p>
                        <p className="text-cream/50 text-sm">{product.name_bn}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-cream">৳{product.price}</TableCell>
                      <TableCell>
                        <Switch
                          checked={product.in_stock}
                          onCheckedChange={() => toggleStock(product)}
                          data-testid={`stock-toggle-${product.id}`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(product)}
                            data-testid={`edit-product-${product.id}`}
                            className="border-primary/30 text-cream hover:bg-primary/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(product.id)}
                            data-testid={`delete-product-${product.id}`}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-surface border-primary/20 text-cream max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cream/70 mb-2">Name (English) *</label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="Kacchi Biryani"
                  data-testid="product-name-en"
                  className="bg-background/50 border-primary/20 text-cream"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Name (Bengali) *</label>
                <Input
                  value={formData.name_bn}
                  onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                  placeholder="কাচ্চি বিরিয়ানি"
                  data-testid="product-name-bn"
                  className="bg-background/50 border-primary/20 text-cream"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cream/70 mb-2">Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-background/50 border-primary/20 text-cream" data-testid="product-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-primary/20">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-cream hover:bg-primary/20">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Price (BDT) *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="350"
                  data-testid="product-price"
                  className="bg-background/50 border-primary/20 text-cream"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-cream/70 mb-2">Image URL</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                data-testid="product-image"
                className="bg-background/50 border-primary/20 text-cream"
              />
            </div>

            <div>
              <label className="block text-sm text-cream/70 mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the dish..."
                rows={3}
                data-testid="product-description"
                className="bg-background/50 border-primary/20 text-cream"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                data-testid="product-stock"
              />
              <label className="text-cream/70">In Stock</label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="border-primary/30 text-cream"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                data-testid="product-submit"
                className="bg-primary text-background hover:bg-primary-hover"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-surface border-primary/20 text-cream">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-cream/70">Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="border-primary/30 text-cream"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(deleteConfirm)}
              data-testid="confirm-delete"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
