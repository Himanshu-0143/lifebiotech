import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Mail, Phone, Loader2 } from 'lucide-react';

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Capture the form element immediately because React's synthetic event
    // may be reused/cleared after an await — accessing e.currentTarget later
    // can become null. Use a local reference instead.
    const formEl = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formEl);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      // Prefer using environment variables for keys. Falls back to existing hardcoded values if not set.
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_f7uoyf2';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_u8dsao9';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'wsCfMPYna3RQABf3V';

      const emailjs = await import('@emailjs/browser');
      // Initialize (recommended) so EmailJS uses your public key for this session
      if (emailjs && typeof emailjs.init === 'function') {
        try {
          emailjs.init(publicKey);
        } catch (initErr) {
          // non-fatal: continue to send even if init throws
          console.warn('EmailJS init warning:', initErr);
        }
      }

      const templateParams = {
        to_name: 'Life Biotech',
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
      };

      const result: any = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('EmailJS send result:', result);

      // EmailJS returns an object like { status: 200, text: 'OK' }
      const ok = result && (result.status === 200 || result.text === 'OK' || result.status === 'OK');
      if (ok) {
        toast({
          title: 'Message sent successfully',
          description: 'We will get back to you soon.',
          variant: 'default',
        });

        // Reset the captured form element
        try {
          formEl.reset();
        } catch (resetErr) {
          console.warn('Form reset failed:', resetErr);
        }
      } else {
        console.warn('EmailJS did not return success:', result);
        toast({
          title: 'Message not sent',
          description: 'Email service did not confirm delivery. Check console for details.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      // Log full error for debugging
      console.error('EmailJS error:', error);

      // Try to show a helpful message from the error when available
      const message = error?.text || error?.message || 'Please try again later.';

      toast({
        title: 'Error sending message',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Have questions about our products or services? We're here to help.
              </p>
            </div>

            <Card className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    Plot No. 120, Vishwapriya Nagar,<br />
                    Bengur, Bengaluru, Karnataka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">info@lifebiotech.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">+91 (80) 2345-6789</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
