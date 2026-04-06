import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyBlog = {
  title: '',
  slug: '',
  content: '',
  thumbnail_url: '',
  author: '',
  published: false
};

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(emptyBlog);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${API}/blogs/all`, { withCredentials: true });
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const openAddModal = () => {
    setEditingBlog(null);
    setFormData(emptyBlog);
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      thumbnail_url: blog.thumbnail_url,
      author: blog.author,
      published: blog.published
    });
    setModalOpen(true);
  };

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: editingBlog ? formData.slug : generateSlug(title)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content || !formData.author) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingBlog) {
        await axios.put(`${API}/blogs/${editingBlog.id}`, formData, { withCredentials: true });
        toast.success('Blog post updated successfully');
      } else {
        await axios.post(`${API}/blogs`, formData, { withCredentials: true });
        toast.success('Blog post created successfully');
      }
      
      setModalOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/blogs/${id}`, { withCredentials: true });
      toast.success('Blog post deleted successfully');
      setDeleteConfirm(null);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Blog Manager</h1>
          <p className="text-cream/60">Create and manage blog posts</p>
        </div>
        <Button
          onClick={openAddModal}
          data-testid="add-blog-btn"
          className="bg-primary text-background hover:bg-primary-hover"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Blog Post
        </Button>
      </div>

      <Card className="bg-surface/40 border-primary/20">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/60">No blog posts found. Write your first post!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-cream/70">Thumbnail</TableHead>
                    <TableHead className="text-cream/70">Title</TableHead>
                    <TableHead className="text-cream/70">Author</TableHead>
                    <TableHead className="text-cream/70">Date</TableHead>
                    <TableHead className="text-cream/70">Status</TableHead>
                    <TableHead className="text-cream/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id} className="border-primary/20">
                      <TableCell>
                        <img
                          src={blog.thumbnail_url}
                          alt={blog.title}
                          className="w-20 h-14 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <p className="text-cream font-medium">{blog.title}</p>
                        <p className="text-cream/50 text-sm">/blog/{blog.slug}</p>
                      </TableCell>
                      <TableCell className="text-cream/70">{blog.author}</TableCell>
                      <TableCell className="text-cream/70">{formatDate(blog.created_at)}</TableCell>
                      <TableCell>
                        {blog.published ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            <Eye className="w-3 h-3 mr-1" /> Published
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400">
                            <EyeOff className="w-3 h-3 mr-1" /> Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(blog)}
                            data-testid={`edit-blog-${blog.id}`}
                            className="border-primary/30 text-cream hover:bg-primary/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(blog.id)}
                            data-testid={`delete-blog-${blog.id}`}
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
        <DialogContent className="bg-surface border-primary/20 text-cream max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-cream/70 mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter blog title"
                data-testid="blog-title"
                className="bg-background/50 border-primary/20 text-cream"
              />
            </div>

            <div>
              <label className="block text-sm text-cream/70 mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-friendly-slug"
                data-testid="blog-slug"
                className="bg-background/50 border-primary/20 text-cream"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cream/70 mb-2">Author *</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  data-testid="blog-author"
                  className="bg-background/50 border-primary/20 text-cream"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Thumbnail URL</label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                  data-testid="blog-thumbnail"
                  className="bg-background/50 border-primary/20 text-cream"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-cream/70 mb-2">Content (HTML supported) *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="<h2>Introduction</h2><p>Write your content here...</p>"
                rows={10}
                data-testid="blog-content"
                className="bg-background/50 border-primary/20 text-cream font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                data-testid="blog-published"
              />
              <label className="text-cream/70">Publish immediately</label>
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
                data-testid="blog-submit"
                className="bg-primary text-background hover:bg-primary-hover"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingBlog ? 'Update' : 'Create'}
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
          <p className="text-cream/70">Are you sure you want to delete this blog post? This action cannot be undone.</p>
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
              data-testid="confirm-delete-blog"
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
