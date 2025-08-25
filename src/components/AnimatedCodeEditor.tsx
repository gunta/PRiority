import React, { useState, useEffect } from 'react';

const AnimatedCodeEditor: React.FC = () => {
	const [currentLine, setCurrentLine] = useState(0);
	const [typedCode, setTypedCode] = useState<string[]>([]);
	const [showSuccess, setShowSuccess] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const codeLines = [
		{ text: "name: PRiority Auto-Fund", indent: 0, highlight: false },
		{ text: "", indent: 0, highlight: false },
		{ text: "on:", indent: 0, highlight: false },
		{ text: "  issues:", indent: 0, highlight: false },
		{ text: "    types: [opened, labeled]", indent: 1, highlight: true },
		{ text: "", indent: 0, highlight: false },
		{ text: "jobs:", indent: 0, highlight: false },
		{ text: "  auto-estimate:", indent: 0, highlight: false },
		{ text: "    runs-on: ubuntu-latest", indent: 1, highlight: false },
		{ text: "    steps:", indent: 1, highlight: false },
		{ text: "      - uses: priority/estimate@v1", indent: 2, highlight: true },
		{ text: "        with:", indent: 2, highlight: false },
		{ text: "          ai-model: claude-3-opus", indent: 3, highlight: true },
		{ text: "          threshold: $100", indent: 3, highlight: false },
		{ text: "          auto-fund: true", indent: 3, highlight: true },
		{ text: "      - name: ✨ Magic happens", indent: 2, highlight: true },
	];

	useEffect(() => {
		const startTyping = async () => {
			setIsTyping(true);
			setTypedCode([]);
			setCurrentLine(0);
			setShowSuccess(false);

			for (let i = 0; i < codeLines.length; i++) {
				await typeLineByLine(i);
			}

			await new Promise(resolve => setTimeout(resolve, 500));
			setShowSuccess(true);
			await new Promise(resolve => setTimeout(resolve, 3000));
			setIsTyping(false);
		};

		const interval = setInterval(() => {
			if (!isTyping) {
				startTyping();
			}
		}, 8000);

		// Start immediately
		if (!isTyping) {
			startTyping();
		}

		return () => clearInterval(interval);
	}, [isTyping]);

	const typeLineByLine = async (lineIndex: number) => {
		const line = codeLines[lineIndex];
		let currentText = '';
		
		for (let i = 0; i <= line.text.length; i++) {
			currentText = line.text.slice(0, i);
			setTypedCode(prev => {
				const newLines = [...prev];
				newLines[lineIndex] = currentText;
				return newLines;
			});
			setCurrentLine(lineIndex);
			await new Promise(resolve => setTimeout(resolve, 30));
		}
	};

	return (
		<div className="relative">
			<div className="glass-card overflow-hidden">
				{/* Editor Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/50">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-full bg-red-500"></div>
						<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div className="w-3 h-3 rounded-full bg-green-500"></div>
					</div>
					<span className="text-xs text-gray-400 font-mono">.github/workflows/priority.yml</span>
					<div className="flex items-center gap-2">
						{showSuccess && (
							<span className="text-xs text-green-400 font-mono animate-fade-in flex items-center gap-1">
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
								</svg>
								Deployed
							</span>
						)}
					</div>
				</div>

				{/* Code Editor */}
				<div className="p-6 bg-gray-950/50 font-mono text-sm">
					<div className="space-y-1">
						{codeLines.map((line, index) => (
							<div
								key={index}
								className={`flex items-center transition-all duration-300 ${
									index === currentLine && isTyping ? 'bg-blue-500/10' : ''
								}`}
							>
								<span className="text-gray-600 mr-4 select-none" style={{ width: '30px' }}>
									{String(index + 1).padStart(2, '0')}
								</span>
								<span
									className={`${
										line.highlight ? 'text-blue-400' : 'text-gray-300'
									} ${index <= currentLine ? 'opacity-100' : 'opacity-0'}`}
									style={{ paddingLeft: `${line.indent * 20}px` }}
								>
									{typedCode[index] || ''}
									{index === currentLine && isTyping && (
										<span className="inline-block w-2 h-4 bg-blue-500 animate-blink ml-1"></span>
									)}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Success Overlay */}
				{showSuccess && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
						<div className="text-center">
							<div className="text-6xl mb-4 animate-bounce">🚀</div>
							<div className="text-2xl font-bold text-white mb-2">Deployed!</div>
							<div className="text-gray-400">Your repo is now PRiority-enabled</div>
						</div>
					</div>
				)}
			</div>

			{/* Feature Badges */}
			<div className="mt-6 flex flex-wrap gap-3 justify-center">
				{['🤖 AI-Powered', '⚡ Instant Setup', '🎯 Zero Config', '💰 Auto-Fund'].map((badge, index) => (
					<div
						key={badge}
						className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm font-medium animate-fade-in"
						style={{ animationDelay: `${index * 100}ms` }}
					>
						{badge}
					</div>
				))}
			</div>
		</div>
	);
};

export default AnimatedCodeEditor;