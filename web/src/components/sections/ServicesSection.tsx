import type { Service } from '@/lib/types';

interface ServicesSectionProps {
  services: Service[] | null;
}

const fallbackServices = [
  { id: 1, icon: '🙏', title: 'Sunday Worship', description: 'Join us every Sunday for an uplifting worship service at 10:00 AM.' },
  { id: 2, icon: '📖', title: 'Bible Study', description: 'Deepen your understanding of Scripture in our weekly small groups.' },
  { id: 3, icon: '❤️', title: 'Community Outreach', description: 'Serving our neighbors in Las Vegas through acts of love and care.' },
];

export default function ServicesSection({ services }: ServicesSectionProps) {
  const items = services && services.length > 0 ? services : null;
  const list = items ?? fallbackServices;

  return (
    <section className="bg-gray-50 dark:bg-[#0a2240] py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#082942] dark:text-white mb-3">Our Ministries</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Discover how we worship, grow, and serve together as a community of faith.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-[#0f2a42] rounded-xl shadow-sm border-2 border-transparent hover:border-[#7CB342] dark:hover:border-[#7CB342] transition-all duration-200 p-6"
            >
              <div className="text-4xl mb-4">{(service as { icon?: string }).icon || '⛪'}</div>
              <h3 className="text-lg font-bold text-[#082942] dark:text-white mb-2">{service.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
