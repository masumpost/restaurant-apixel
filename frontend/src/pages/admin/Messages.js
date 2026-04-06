import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Trash2, Loader2, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMessage, setViewMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API}/contacts`, { withCredentials: true });
      setMessages(data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/contacts/${id}`, { withCredentials: true });
      toast.success('Message deleted successfully');
      setDeleteConfirm(null);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream mb-2">Messages</h1>
        <p className="text-cream/60">View contact form submissions</p>
      </div>

      <Card className="bg-surface/40 border-primary/20">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/60">No messages yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-cream/70">Name</TableHead>
                    <TableHead className="text-cream/70">Phone</TableHead>
                    <TableHead className="text-cream/70">Message</TableHead>
                    <TableHead className="text-cream/70">Date</TableHead>
                    <TableHead className="text-cream/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id} className="border-primary/20">
                      <TableCell className="text-cream font-medium">{msg.name}</TableCell>
                      <TableCell>
                        <a
                          href={`tel:${msg.phone}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Phone size={14} />
                          {msg.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-cream/70 max-w-md">
                        <p className="line-clamp-2 cursor-pointer hover:text-cream" onClick={() => setViewMessage(msg)}>
                          {msg.message}
                        </p>
                      </TableCell>
                      <TableCell className="text-cream/70">{formatDate(msg.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewMessage(msg)}
                            data-testid={`view-message-${msg.id}`}
                            className="border-primary/30 text-cream hover:bg-primary/10"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(msg.id)}
                            data-testid={`delete-message-${msg.id}`}
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

      {/* View Message Modal */}
      <Dialog open={!!viewMessage} onOpenChange={() => setViewMessage(null)}>
        <DialogContent className="bg-surface border-primary/20 text-cream">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Message from {viewMessage?.name}</DialogTitle>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4">
              <div>
                <p className="text-cream/50 text-sm">Phone</p>
                <a href={`tel:${viewMessage.phone}`} className="text-primary hover:underline">
                  {viewMessage.phone}
                </a>
              </div>
              <div>
                <p className="text-cream/50 text-sm">Date</p>
                <p className="text-cream">{formatDate(viewMessage.created_at)}</p>
              </div>
              <div>
                <p className="text-cream/50 text-sm">Message</p>
                <p className="text-cream whitespace-pre-wrap">{viewMessage.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setViewMessage(null)}
              className="bg-primary text-background hover:bg-primary-hover"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-surface border-primary/20 text-cream">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-cream/70">Are you sure you want to delete this message? This action cannot be undone.</p>
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
              data-testid="confirm-delete-message"
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
