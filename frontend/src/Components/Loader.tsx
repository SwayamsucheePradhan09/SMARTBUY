import { motion } from "framer-motion";

const Loader = () => {
  const platforms = ["Amazon", "Flipkart", "Meesho", "Temu", "Croma"];
  
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 16px',
    }}>
      {/* Spinner */}
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        {/* Outer glow */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'rgba(99,102,241,0.2)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'rgba(99,102,241,0.3)',
          }}
        />
        {/* Core */}
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(22,22,51,0.8)',
          border: '1px solid rgba(99,102,241,0.15)',
          boxShadow: '0 0 40px rgba(99,102,241,0.1)',
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: '3px solid rgba(99,102,241,0.1)',
              borderTopColor: '#6366f1',
            }}
          />
        </div>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '32px', textAlign: 'center' }}
      >
        <h3 style={{
          fontSize: '18px', fontWeight: 800, color: '#e2e8f0', marginBottom: '8px',
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}>
          Scanning Global Stores...
        </h3>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#64748b', maxWidth: '300px', lineHeight: 1.6 }}>
          Our AI agents are finding the best prices across all platforms.
        </p>
      </motion.div>

      {/* Platform scan animation */}
      <div style={{
        display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {platforms.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            style={{
              padding: '6px 14px', borderRadius: '8px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.12)',
              fontSize: '10px', fontWeight: 700, color: '#818cf8',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}
          >
            {name}
          </motion.div>
        ))}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '24px' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
