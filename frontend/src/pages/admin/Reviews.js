import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Trash2, Loader2, Star, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API}/reviews/all`, { withCredentials: true });
      setReviews(data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (review) => {
    try {
      await axios.patch(`${API}/reviews/${review.id}/approve`, {}, { withCredentials: true });
      toast.success(`Review ${review.approved ? 'hidden' : 'approved'} successfully`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/reviews/${id}`, { withCredentials: true });
      toast.success('Review deleted successfully');
      setDeleteConfirm(null);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
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
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream mb-2">Reviews Manager</h1>
        <p className="text-cream/60">Manage customer reviews and testimonials</p>
      </div>

      <Card className="bg-surface/40 border-primary/20">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/60">No reviews yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-cream/70">Reviewer</TableHead>
                    <TableHead className="text-cream/70">Rating</TableHead>
                    <TableHead className="text-cream/70">Comment</TableHead>
                    <TableHead className="text-cream/70">Date</TableHead>
                    <TableHead className="text-cream/70">Status</TableHead>
                    <TableHead className="text-cream/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} className="border-primary/20">
                      <TableCell className="text-cream font-medium">{review.reviewer_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-primary fill-primary' : 'text-cream/20'}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-cream/70 max-w-md">
                        <p className="line-clamp-2">{review.comment}</p>
                      </TableCell>
                      <TableCell className="text-cream/70">{formatDate(review.created_at)}</TableCell>
                      <TableCell>
                        {review.approved ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            <Check className="w-3 h-3 mr-1" /> Approved
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400">
                            <X className="w-3 h-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleApproval(review)}
                            data-testid={`toggle-review-${review.id}`}
                            className={review.approved 
                              ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                              : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                            }
                          >
                            {review.approved ? 'Hide' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(review.id)}
                            data-testid={`delete-review-${review.id}`}
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

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-surface border-primary/20 text-cream">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-cream/70">Are you sure you want to delete this review? This action cannot be undone.</p>
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
              data-testid="confirm-delete-review"
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
