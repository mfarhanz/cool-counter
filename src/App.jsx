import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const fontOptions = [
  'Audiowide', 'Barrio', 'Belanosima', 'Bitcount Ink', 'Bodoni Moda', 'Cabin Sketch',
  'Chelsea Market', 'Crafty Girls', 'DM Serif Text', 'Doto', 'Expletus Sans', 'Freckle Face',
  'Fredericka the Great', 'Graduate', 'Handjet', 'Holtwood One SC', 'Imbue', 'Kode Mono',
  'Lugrasimo', 'Margarine', 'Michroma', 'Monda', 'Newsreader', 'Orbitron', 'Pinyon Script',
  'Press Start 2P', 'Prosto One', 'Public Sans', 'Rye', 'Sedgwick Ave', 'Shadows Into Light',
  'Silkscreen', 'Special Elite', 'Swanky and Moo Moo', 'Uncial Antiqua', 'Wallpoet', 'Workbench'
]

const colorOptions = [
  // Neutrals
  '#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#d9d9d9', '#bfbfbf', '#a6a6a6', '#8c8c8c', '#737373', '#595959', '#434343', '#262626', '#1a1a1a', '#0d0d0d', '#000000',
  // Reds & Pinks
  '#fff1f0', '#ffccc7', '#ffa39e', '#ff7875', '#ff4d4f', '#f5222d', '#cf1322', '#a8071a', '#eb2f96', '#ffadd2', '#ff85c0', '#f759ab', '#d93692', '#c41d7f',
  // Oranges & Yellows
  '#fffbe6', '#fff1b8', '#ffe58f', '#ffd666', '#ffc53d', '#faad14', '#fadb14', '#ffec3d', '#ffd591', '#ffa940', '#fa8c16', '#d46b08', '#ad4e00',
  // Greens
  '#f6ffed', '#d9f7be', '#b7eb8f', '#95de64', '#73d13d', '#52c41a', '#389e0d', '#237804', '#135200',
  // Cyans & Blues
  '#e6f7ff', '#bae7ff', '#91d5ff', '#69c0ff', '#40a9ff', '#1890ff', '#096dd9', '#0050b3', '#003a8c', '#36cfc9', '#13c2c2', '#08979c', '#006d75',
  // Purples
  '#f9f0ff', '#efdbff', '#d3adf7', '#b37feb', '#9254de', '#722ed1', '#531dab', '#391085', '#22075e',
  // Misc pastels
  '#fff7e6', '#ffe7ba', '#ffc069', '#ffd6e7', '#eaff8f', '#d3f261', '#a0d911',
  // Earth tones / muted
  '#f5f5dc', '#deb887', '#cd853f', '#d2b48c', '#a0522d', '#8b4513', '#7b5e57', '#708090', '#596e79', '#2f4f4f',
  // Gradient-friendly
  '#7f5af0', '#00bcd4'
];

export default function App() {
  const [count, setCount] = useState(0)
  const [fontColor, setFontColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#000000') // default
  const [fontFamily, setFontFamily] = useState('Audiowide')
  const [showColors, setShowColors] = useState(false)
  const [showBgColors, setShowBgColors] = useState(false);
  const [showFonts, setShowFonts] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [prevCount, setPrevCount] = useState(0)
  const [direction, setDirection] = useState('up') // 'up' or 'down'
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const touchStartY = useRef(null);
  const containerRef = useRef(null);

  const prevStr = prevCount.toString()
  const currStr = count.toString()
  // To compare digits from the right (ones place), pad the shorter string on the left with spaces
  const maxLen = Math.max(prevStr.length, currStr.length)
  const prevPadded = prevStr.padStart(maxLen, ' ')
  const currPadded = currStr.padStart(maxLen, ' ')
  
  const popupVariants = {
	  hidden: { opacity: 0, scale: 1.2, pointerEvents: 'none' },
	  visible: { opacity: 1, scale: 1, pointerEvents: 'auto' },
	};
	
  const popupTransition = { duration: 0.2, ease: 'easeInOut' };
  
  const animatedDigits = currPadded.split('').map((digit, index) => {
    const prevDigit = prevPadded[index]
    const hasChanged = digit !== prevDigit
    if (digit === ' ') return <span key={index}>&nbsp;</span>

    // Define animation direction based on increment or decrement
    const initialY = direction === 'up' ? 40 : -40
    const exitY = direction === 'up' ? -40 : 40

    return (
      <span key={index} className="inline-block w-[1ch] text-center">
        <AnimatePresence mode="wait">
          {hasChanged ? (
            <motion.span
              key={digit}
              initial={{ y: initialY, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: exitY, opacity: 0 }}
              transition={{ duration: 0.1 }}				  
              className="inline-block"
            >
              {digit}
            </motion.span>
          ) : (
            <span>{digit}</span>
          )}
        </AnimatePresence>
      </span>
    )
  })
  
  const handleClick = (e) => {
    if (e.target.closest('.control')) return

    if (e.type === 'click') {	// LMB
      setDirection('up')
      setPrevCount(count)
      setCount(prev => Math.min(999999999999, prev + 1))
    } else if (e.type === 'contextmenu') {	// RMB
      e.preventDefault()
      setDirection('down')
      setPrevCount(count)
      setCount(prev => Math.max(0, prev - 1))
    }  else if (e.type === 'mousedown' && e.button === 1) {	// Scroll button
		 e.preventDefault();
		 setCount(0);
	  }
  }
  
  useEffect(() => {
	  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	  setIsTouchDevice(isTouch);
	}, []);
  
  useEffect(() => {
	  const container = containerRef.current;
	  if (!container) return;

	  let timeoutId = null;
	  let startY = 0;

	  const handleTouchStart = (e) => {
		 if (e.target.closest('.control')) return;

		 startY = e.touches[0].clientY;

		 // Start 2-second timer for reset
		 timeoutId = setTimeout(() => {
			setCount(0);
		 }, 2000);
	  };

	  const handleTouchMove = (e) => {
		 const currentY = e.touches[0].clientY;
		 const deltaY = currentY - startY;

		 // Cancel reset if moved
		 if (Math.abs(deltaY) > 10 && timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		 }
	  };

	  const handleTouchEnd = (e) => {
		 if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		 }

		 const endY = e.changedTouches[0].clientY;
		 const deltaY = startY - endY;

		 if (Math.abs(deltaY) < 30) return; // Ignore minor swipes

		 setPrevCount(count);

		 if (deltaY > 30) {
			// Swipe up = increment
			setDirection('up');
			setCount(prev => Math.min(999999999999, prev + 1));
		 } else if (deltaY < -30) {
			// Swipe down = decrement
			setDirection('down');
			setCount(prev => Math.max(0, prev - 1));
		 }
	  };

	  container.addEventListener('touchstart', handleTouchStart, { passive: true });
	  container.addEventListener('touchmove', handleTouchMove, { passive: true });
	  container.addEventListener('touchend', handleTouchEnd);

	  return () => {
		 container.removeEventListener('touchstart', handleTouchStart);
		 container.removeEventListener('touchmove', handleTouchMove);
		 container.removeEventListener('touchend', handleTouchEnd);
	  };
	}, [count]);


  return (
    <div
      className="w-screen h-screen relative overflow-hidden duration-500 ease-in-out"
      style={{ fontFamily, backgroundColor: bgColor, '--font-color': fontColor }}
    >
      {/* Centered number */}
      <div ref={containerRef}
			  className="counter-container" 
			  onClick={handleClick}
			  onContextMenu={handleClick}
			  onMouseDown={handleClick}
		>
        <div className={`counter-number flex digits-${count.toString().length}`}>{animatedDigits}</div>
      </div>
		
		{/* 🎨 Color Picker */}
		<div
		  className="control-wrapper top-left"
		  onMouseEnter={() => setShowColors(true)}
		  onMouseLeave={() => setShowColors(false)}
		>
		  <div className="control-btn">
			 <div className="icon-symbol">&#9998;</div>
		  </div>
		  <motion.div
			  className="popup-panel color-popup top-full left-0"
			  variants={popupVariants}
			  initial="hidden"
			  animate={showColors ? "visible" : "hidden"}
			  transition={popupTransition}
			>
			  {colorOptions.map((color) => (
				 <div
					key={color}
					className={`color-swatch ${fontColor === color ? 'selected' : ''}`}
					style={{
					  backgroundColor: fontColor === color ? color : `${color}cc`,
					}}
					onClick={() => setFontColor(color)}
				 />
			  ))}
			</motion.div>
		</div>

      {/* 🅰️ Font Selector */}
		<div
		  className="control-wrapper top-right"
		  onMouseEnter={() => setShowFonts(true)}
		  onMouseLeave={() => setShowFonts(false)}
		>
		  <div className="control-btn">
			 <div className="icon-symbol">&#10001;</div>
		  </div>
		  <motion.div
			 className="popup-panel font-popup top-full right-0"
			 variants={popupVariants}
			 initial="hidden"
			 animate={showFonts ? "visible" : "hidden"}
			 transition={popupTransition}
		  >
			 <div className="font-popup-inner">
				{fontOptions.map((font) => (
				  <button
					 key={font}
					 className={`font-option flex items-center justify-center ${
						fontFamily === font ? 'selected' : ''
					 }`}
					 style={{ fontFamily: font, '--font-color': fontColor }}
					 onClick={() => setFontFamily(font)}
				  >
					 {font}
				  </button>
				))}
			 </div>
		  </motion.div>
		</div>
		
		{/* 🎨 Background Color Picker */}
		<div
		  className="control-wrapper bottom-left"
		  onMouseEnter={() => setShowBgColors(true)}
		  onMouseLeave={() => setShowBgColors(false)}
		>
		  <div className="control-btn">
			 <div className="icon-symbol">&#9640;</div>
		  </div>
		  <motion.div
			  className="popup-panel color-popup bottom-full left-0 mb-2"
			  variants={popupVariants}
			  initial="hidden"
			  animate={showBgColors ? "visible" : "hidden"}
			  transition={popupTransition}
			>
			  {colorOptions.map((color) => (
				 <div
					key={color}
					className={`color-swatch ${bgColor === color ? 'selected' : ''}`}
					style={{
					  backgroundColor: bgColor === color ? color : `${color}cc`,
					}}
					onClick={() => setBgColor(color)}
				 />
			  ))}
			</motion.div>
		</div>

      {/* ❓ Help Popup */}
      <div
		  className="control-wrapper bottom-right"
		  onMouseEnter={() => setShowHelp(true)}
		  onMouseLeave={() => setShowHelp(false)}
		>
		  <div className="control-btn">
			 <div className="icon-symbol">?</div>
		  </div>
		  <motion.div
			  className="help-popup bottom-full mb-2 right-0"
			  variants={popupVariants}
			  initial="hidden"
			  animate={showHelp ? "visible" : "hidden"}
			  transition={popupTransition}
			>
			  {isTouchDevice ? (
				  <>
					 <p>Just another counter webapp.</p>
					 <p>Swipe up anywhere to increment.</p>
					 <p>Swipe down to decrement.</p>
					 <p>Hold briefly to reset.</p>
					 <p>Use corner buttons to change font and color.</p>
				  </>
				) : (
				  <>
					 <p>Just another counter webapp.</p>
					 <p>Left click anywhere to increment.</p>
					 <p>Right click to decrement.</p>
					 <p>Middle click to reset.</p>
					 <p>Use corner buttons to change font and color.</p>
				  </>
				)}
			</motion.div>
		</div>
    </div>
  )
}
