import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      <p className="text-muted-foreground">Your order history will appear here</p>
    </div>
  );
}
