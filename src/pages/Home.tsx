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
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float hidden md:block"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float hidden md:block" style={{ animationDelay: '1s' }}></div>
        
        <div className="container-custom relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              Quality Healthcare Solutions for a Healthier Tomorrow
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-white/90 animate-fade-in stagger-2">
              Life Biotech manufactures premium pharmaceutical products trusted by healthcare professionals across India.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 animate-fade-in stagger-3">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="group w-full sm:w-auto shadow-lg hover:shadow-xl">
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-all shadow-lg hover:shadow-xl">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Quality Assured', desc: 'WHO-GMP certified manufacturing', color: 'text-blue-500' },
              { icon: Zap, title: 'Fast Delivery', desc: 'Quick and reliable shipping', color: 'text-yellow-500' },
              { icon: Heart, title: 'Trusted Brand', desc: 'Recommended by doctors', color: 'text-red-500' },
              { icon: Award, title: 'ISO Certified', desc: 'International quality standards', color: 'text-green-500' },
            ].map((feature, index) => (
              <Card key={index} className={`card-hover border-0 shadow-card group animate-scale-in stagger-${index + 1}`}>
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              Discover our range of quality pharmaceutical products manufactured with the highest standards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.map((product, index) => (
              <Link key={product.id} to={`/products/${encodeURIComponent(product.id)}`}>
                <Card className={`card-hover overflow-hidden border-0 shadow-card group animate-scale-in stagger-${Math.min(index + 1, 6)}`}>
                  <div className="bg-gradient-primary h-40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors shimmer"></div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 font-medium">{product.form}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.composition}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">In Stock</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in stagger-4">
            <Link to="/products">
              <Button size="lg" className="btn-primary shadow-lg hover:shadow-xl">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 gradient-text">About Life Biotech</h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Life Biotech is a leading pharmaceutical manufacturing company committed to producing high-quality medicines that improve lives. With state-of-the-art facilities and a dedicated team of professionals, we ensure that every product meets international quality standards.
              </p>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Our comprehensive range of pharmaceutical products includes tablets, injections, syrups, and specialized formulations, all designed to address various healthcare needs.
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-primary hover:bg-primary hover:text-white text-primary font-semibold shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-secondary rounded-2xl h-64 sm:h-80 md:h-96 flex items-center justify-center relative overflow-hidden group animate-slide-in-right shadow-xl">
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
              <div className="text-white text-center p-8 relative z-10">
                <div className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 animate-float">18+</div>
                <div className="text-xl sm:text-2xl font-semibold">Quality Products</div>
                <div className="mt-4 text-sm sm:text-base opacity-90">Trusted by Healthcare Professionals</div>
              </div>
              <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float hidden md:block"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float hidden md:block" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
