import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function HelpCenter() {
  const faqs = [
    {
      question: 'How do I rent an item?',
      answer: 'Browse items, select your dates, and send a rental request to the owner.',
    },
    {
      question: 'When do I get charged?',
      answer: 'Payment is only processed after the owner approves your rental request.',
    },
    {
      question: 'How do I list an item?',
      answer: 'Click "List New Item" from your dashboard and fill in the details.',
    },
    {
      question: 'What if something goes wrong?',
      answer: 'Contact our support team at support@rentall.az for assistance.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="page-container max-w-3xl">
          <h1 className="text-4xl font-bold text-center mb-4">Help Center</h1>
          <p className="text-muted-foreground text-center mb-12">
            Find answers to common questions
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card-static p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}