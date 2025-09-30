import { useState } from 'react'
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

  const prevStr = prevCount.toString()
	const currStr = count.toString()
	// To compare digits from the right (ones place), pad the shorter string on the left with spaces
	const maxLen = Math.max(prevStr.length, currStr.length)
	const prevPadded = prevStr.padStart(maxLen, ' ')
	const currPadded = currStr.padStart(maxLen, ' ')

  const handleClick = (e) => {
    if (e.target.closest('.control')) return

    if (e.type === 'click') {	// LMB
      setDirection('up')
      setPrevCount(count)
      setCount(prev => Math.min(9999999, prev + 1))
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
  
  const popupTransition = {	  	  
	  initial: { opacity: 0, scale: 1.2, filter: 'blur(4px)' },
	  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
	  exit: { opacity: 0, scale: 0.75, filter: 'blur(4px)' },
	  transition: { duration: 0.3, ease: 'easeInOut' }	  
	};


  return (
    <div
      className="w-screen h-screen relative overflow-hidden duration-500 ease-in-out"
      style={{ fontFamily, backgroundColor: bgColor, '--font-color': fontColor }}
    >
      {/* Centered number */}
      <div className="counter-container" 
			  onClick={handleClick}
			  onContextMenu={handleClick}
			  onMouseDown={handleClick}
		>
        <div className="counter-number flex">{animatedDigits}</div>
      </div>
		
		{/* 🎨 Color Picker */}
		<div
		  className="control-wrapper top-left"
		  onMouseEnter={() => setShowColors(true)}
		  onMouseLeave={() => setShowColors(false)}
		>
		  <div className="control-btn">
			 <div className="icon-symbol">🖌</div>
		  </div>

		  <AnimatePresence>
			 {showColors && (
				<motion.div
				  key="font-color-popup"
				  className="popup-panel color-popup top-full left-0"
				  {...popupTransition}
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
			 )}
		  </AnimatePresence>
		</div>

      {/* 🅰️ Font Selector */}
		<div
		  className="control-wrapper top-right"
		  onMouseEnter={() => setShowFonts(true)}
		  onMouseLeave={() => setShowFonts(false)}
		>
		  <div className="control-btn">
			 <div className="icon-symbol">🖋</div>
		  </div>
		  <AnimatePresence>
			  {showFonts && (
				 <motion.div
					key="font-selector-popup"
					className="popup-panel font-popup top-full right-0"
					{...popupTransition}
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
			  )}
			</AnimatePresence>
		</div>
		
		{/* 🎨 Background Color Picker */}
		<div
		  className="control-wrapper bottom-left"
		  onMouseEnter={() => setShowBgColors(true)}
		  onMouseLeave={() => setShowBgColors(false)}
		>
		  <div className="control-btn">
			 <div className="icon-symbol">🌢</div>
		  </div>
		  <AnimatePresence>
			  {showBgColors && (
				 <motion.div
					key="bg-color-popup"
					className="popup-panel color-popup bottom-full left-0 mb-2"
					{...popupTransition}
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
			  )}
			</AnimatePresence>
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
		  <AnimatePresence>
			  {showHelp && (
				 <motion.div
					key="help-popup"
					className="help-popup bottom-full mb-2 right-0"
					{...popupTransition}
				 >
					<p>Just another counter webapp.</p>
					<p>Left click anywhere to increment.</p>
					<p>Right click to decrement.</p>
					<p>Middle click to reset.</p>
					<p>Use corner buttons to change font and color.</p>
				 </motion.div>
			  )}
			</AnimatePresence>
		</div>
    </div>
  )
}
