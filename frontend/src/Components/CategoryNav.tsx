import { motion } from "framer-motion";
import { FiGrid, FiTarget, FiSmartphone, FiHeart, FiGift, FiHome } from "react-icons/fi";

const categories = [
  { name: "All", icon: <FiGrid /> },
  { name: "Fashion", icon: <FiHeart /> },
  { name: "Electronics", icon: <FiSmartphone /> },
  { name: "Home", icon: <FiHome /> },
  { name: "Kids", icon: <FiTarget /> },
  { name: "Niche", icon: <FiGift /> },
];

interface Props {
  selectedCategory: string;
  onSelect: (name: string) => void;
}

const CategoryNav = ({ selectedCategory, onSelect }: Props) => {
  return (
    <div className="no-scrollbar" style={{
      display: 'flex', justifyContent: 'center', gap: '8px',
      marginBottom: '36px', padding: '0 16px',
      overflowX: 'auto',
    }}>
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.name;
        return (
          <motion.button
            key={cat.name}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelect(cat.name)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '12px',
              fontSize: '13px', fontWeight: 700,
              whiteSpace: 'nowrap',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Inter', system-ui, sans-serif",
              background: isActive
                ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                : 'rgba(255,255,255,0.04)',
              color: isActive ? '#fff' : '#94a3b8',
              boxShadow: isActive
                ? '0 4px 20px rgba(99,102,241,0.3)'
                : 'none',
              ...(isActive ? {} : {
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(255,255,255,0.06)',
              }),
            }}
          >
            <span style={{ opacity: isActive ? 1 : 0.5, display: 'flex' }}>{cat.icon}</span>
            {cat.name}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryNav;
