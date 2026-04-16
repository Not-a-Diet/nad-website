import { parseDescriptionList } from '../utils/description-parser';

// --- Types & Interfaces ---

interface PhilosophyItem {
  id: number;
  title: string;
  description: string;
}

interface PhilosophyProps {
  data: {
      title?: string;
      body: string;
      type: 'quotation' | 'filosofy';
      sign?: string;
      isList: boolean;
      items?: PhilosophyItem[];
  };
}

/**
 * Maps a title string to a specific icon component.
 * This bridges the gap since the API doesn't provide the icon image.
 */
const getIconForTitle = (title: string) => {
  const normalized = title.toLowerCase();
  
  if (normalized.includes('educazione')) return "🎓";
  if (normalized.includes('equilibrio')) return "⚖️";
  if (normalized.includes('sostenibilità')) return "🌱";
  
  // Fallback icon
  return "🌱";
};

// --- Sub-Components ---

const PhilosophyList = ({ 
  title, 
  items 
}: { 
  title?: string; 
  items: PhilosophyItem[];
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      {title && (
        <h2 className="text-3xl font-bold mb-12 font-sans">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            {/* Icon Circle */}
            <div className="w-16 h-16 text-2xl rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
               {getIconForTitle(item.title)}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-crema-DEFAULT mb-3 font-sans">
              {item.title}
            </h3>
            
            {/* Description */}
            <p className="text-crema-500 leading-relaxed font-sans">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PhilosophyQuote = ({ 
  body, 
  sign 
}: { 
  body: string; 
  sign?: string 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-4">
      <blockquote className="text-xl md:text-2xl font-medium text-crema-DEFAULT mb-6 font-sans leading-relaxed">
        "{body}"
      </blockquote>
      {sign && (
        <cite className="text-crema-500 not-italic text-lg font-sans">
          — {sign}
        </cite>
      )}
    </div>
  );
};


export default function Quote({ data }: PhilosophyProps) {
  if (!data) {
    return null; // or some fallback UI
  }
  const { title, body, type, sign, isList, items } = data;

  const philosophyItems: PhilosophyItem[] = items && items.length > 0
    ? items
    : parseDescriptionList(body).map((item, index) => ({
        id: index,
        title: item,
        description: item,
      }));

  const bgClasses = "bg-gradient-to-br drop-shadow-md from-secondary-100/60 via-anti-flash_white-100 to-tertiary-100/60";

  return (
    <section className="flex items-center justify-center w-full py-8 px-4 md:px-8">
      <div className={`w-fit ${bgClasses} rounded-[2.5rem] p-10 lg:p-6 min-h-[300px] flex items-center justify-center`}>
        
        {isList ? (
          <PhilosophyList 
            title={title} 
            items={philosophyItems} 
          />
        ) : (
          <PhilosophyQuote 
            body={body} 
            sign={sign} 
          />
        )}

      </div>
    </section>
  );
}
