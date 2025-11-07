import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Heart, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Home() {
  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(6);
      return data || [];
    },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMiAyLTQgNC00czQgMiA0IDQtMiA0LTQgNGMtMiAwLTQtMi00LTR6bS0yNCAwYzAtMiAyLTQgNC00czQgMiA0IDQtMiA0LTQgNGMtMiAwLTQtMi00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container-custom relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Quality Healthcare Solutions for a Healthier Tomorrow
            </h1>
            <p className="text-xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Life Biotech manufactures premium pharmaceutical products trusted by healthcare professionals across India.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/products">
                <Button size="lg" variant="secondary" className="group">
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-all">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Quality Assured', desc: 'WHO-GMP certified manufacturing' },
              { icon: Zap, title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
              { icon: Heart, title: 'Trusted Brand', desc: 'Recommended by doctors' },
              { icon: Award, title: 'ISO Certified', desc: 'International quality standards' },
            ].map((feature, index) => (
              <Card key={index} className="card-hover border-0 shadow-card">
                <CardContent className="pt-6">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our range of quality pharmaceutical products manufactured with the highest standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.map((product) => (
              <Card key={product.id} className="card-hover overflow-hidden border-0 shadow-card">
                <div className="bg-gradient-primary h-32">
                  {/* Image placeholder - will be replaced later */}
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.form}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.composition}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="btn-primary">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">About Life Biotech</h2>
              <p className="text-muted-foreground mb-4">
                Life Biotech is a leading pharmaceutical manufacturing company committed to producing high-quality medicines that improve lives. With state-of-the-art facilities and a dedicated team of professionals, we ensure that every product meets international quality standards.
              </p>
              <p className="text-muted-foreground mb-6">
                Our comprehensive range of pharmaceutical products includes tablets, injections, syrups, and specialized formulations, all designed to address various healthcare needs.
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-primary hover:bg-primary hover:text-white text-primary font-semibold">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-secondary rounded-lg h-80 flex items-center justify-center">
              <div className="text-white text-center p-8">
                <div className="text-6xl font-bold mb-2">18+</div>
                <div className="text-xl">Quality Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
