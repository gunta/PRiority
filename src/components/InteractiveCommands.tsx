import React, { useState, useEffect } from 'react';

const InteractiveCommands: React.FC = () => {
	const [activeCommand, setActiveCommand] = useState(0);
	const [isExecuting, setIsExecuting] = useState(false);
	const [commandOutput, setCommandOutput] = useState('');
	const [typingText, setTypingText] = useState('');
	const [achievements, setAchievements] = useState<string[]>([]);
	const [autoMode, setAutoMode] = useState(true);
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

	const commands = [
		{
			icon: '💰',
			command: '/fund',
			description: 'Fund an issue instantly',
			output: '✅ Issue #1234 funded with $500\n🎯 Developer matched\n⚡ Work started immediately',
			achievement: '💵 First Funding!'
		},
		{
			icon: '🤖',
			command: '/estimate',
			description: 'AI-powered cost estimation',
			output: '🔍 Analyzing complexity...\n📊 8 hours estimated\n💵 Suggested: $800',
			achievement: '🧠 AI Activated!'
		},
		{
			icon: '📊',
			command: '/status',
			description: 'Track funding progress',
			output: '📈 4 issues funded today\n💰 $3,200 total\n⏱️ Avg resolution: 4.2 hours',
			achievement: '📊 Stats Unlocked!'
		},
		{
			icon: '🏆',
			command: '/leaderboard',
			description: 'Top contributors & fixers',
			output: '🥇 @developer1 - 12 fixes\n🥈 @funder2 - $5,000 funded\n🥉 @maintainer3 - 8 merges',
			achievement: '🏆 Hall of Fame!'
		},
		{
			icon: '⚡',
			command: '/boost',
			description: 'Prioritize critical issues',
			output: '🚨 Issue boosted to critical\n💎 3x funding multiplier active\n🔥 5 developers notified',
			achievement: '🚀 Turbo Mode!'
		},
		{
			icon: '🎯',
			command: '/match',
			description: 'Find perfect developer',
			output: '🔍 Scanning 1,247 developers...\n✅ 3 perfect matches found\n📬 Invitations sent',
			achievement: '🤝 Matchmaker!'
		}
	];

	useEffect(() => {
		if (!autoMode) {
			if (intervalId) {
				clearInterval(intervalId);
				setIntervalId(null);
			}
			return;
		}

		const cycleCommands = async () => {
			if (!autoMode) return;
			
			const nextCommand = (activeCommand + 1) % commands.length;
			setActiveCommand(nextCommand);
			
			// Auto-execute after a delay
			await new Promise(resolve => setTimeout(resolve, 2000));
			if (!isExecuting && autoMode) {
				executeCommand(nextCommand);
			}
		};

		const interval = setInterval(cycleCommands, 5000);
		setIntervalId(interval);
		
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [activeCommand, isExecuting, autoMode]);

	const handleCommandClick = (index: number) => {
		if (isExecuting) return;
		
		// Stop auto mode when user clicks
		setAutoMode(false);
		
		// Clear any existing interval
		if (intervalId) {
			clearInterval(intervalId);
			setIntervalId(null);
		}
		
		// Set active command and execute
		setActiveCommand(index);
		executeCommand(index);
	};

	const executeCommand = async (index: number) => {
		setIsExecuting(true);
		setCommandOutput('');
		setTypingText('');
		
		const cmd = commands[index];
		
		// Type the command
		for (let i = 0; i <= cmd.command.length; i++) {
			setTypingText(cmd.command.slice(0, i));
			await new Promise(resolve => setTimeout(resolve, 50));
		}
		
		await new Promise(resolve => setTimeout(resolve, 300));
		
		// Show output with typing effect
		const lines = cmd.output.split('\n');
		let fullOutput = '';
		for (const line of lines) {
			fullOutput += line + '\n';
			setCommandOutput(fullOutput);
			await new Promise(resolve => setTimeout(resolve, 400));
		}
		
		// Add achievement
		if (!achievements.includes(cmd.achievement)) {
			await new Promise(resolve => setTimeout(resolve, 500));
			setAchievements(prev => [...prev, cmd.achievement]);
		}
		
		await new Promise(resolve => setTimeout(resolve, 1500));
		setIsExecuting(false);
	};

	return (
		<div className="space-y-8">
			{/* Command Palette */}
			<div className="glass-card p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold">Command Palette</h3>
					<div className="flex items-center gap-4">
						{!autoMode && (
							<button
								onClick={() => setAutoMode(true)}
								className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-full hover:bg-blue-500/30 transition"
							>
								Resume Auto Mode
							</button>
						)}
						{autoMode && (
							<div className="flex items-center gap-2 text-xs text-gray-400">
								<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
								<span>Auto Mode</span>
							</div>
						)}
					</div>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
					{commands.map((cmd, index) => (
						<button
							key={cmd.command}
							onClick={() => handleCommandClick(index)}
							disabled={isExecuting}
							className={`p-4 rounded-lg border transition-all duration-300 text-left ${
								activeCommand === index
									? 'bg-blue-500/20 border-blue-500 scale-105 shadow-lg shadow-blue-500/20'
									: 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:border-gray-600'
							} ${isExecuting ? 'cursor-wait' : 'cursor-pointer'}`}
						>
							<div className="flex items-start gap-3">
								<span className="text-2xl">{cmd.icon}</span>
								<div className="flex-1">
									<div className="font-mono text-sm text-blue-400">{cmd.command}</div>
									<div className="text-xs text-gray-400 mt-1">{cmd.description}</div>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Terminal Output */}
			<div className="glass-card overflow-hidden">
				<div className="px-4 py-3 border-b border-gray-700 bg-gray-900/50 flex items-center justify-between">
					<span className="text-sm font-mono text-gray-400">Terminal</span>
					<div className="flex gap-1">
						<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
						<span className="text-xs text-gray-500">Live</span>
					</div>
				</div>
				<div className="p-6 bg-black/50 font-mono text-sm min-h-[200px]">
					{typingText && (
						<div className="text-green-400 mb-2">
							$ {typingText}
							{isExecuting && <span className="animate-blink">_</span>}
						</div>
					)}
					{commandOutput && (
						<pre className="text-gray-300 whitespace-pre-wrap animate-fade-in">{commandOutput}</pre>
					)}
				</div>
			</div>

			{/* Achievements */}
			{achievements.length > 0 && (
				<div className="flex flex-wrap gap-3 justify-center">
					{achievements.map((achievement, index) => (
						<div
							key={achievement}
							className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm font-medium animate-slide-up"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							{achievement}
						</div>
					))}
				</div>
			)}

			{/* Stats Bar */}
			<div className="grid grid-cols-4 gap-4">
				<div className="glass-card p-4 text-center">
					<div className="text-2xl font-bold gradient-text animate-pulse">24/7</div>
					<div className="text-xs text-gray-400">Always On</div>
				</div>
				<div className="glass-card p-4 text-center">
					<div className="text-2xl font-bold gradient-text animate-pulse">0ms</div>
					<div className="text-xs text-gray-400">Latency</div>
				</div>
				<div className="glass-card p-4 text-center">
					<div className="text-2xl font-bold gradient-text animate-pulse">∞</div>
					<div className="text-xs text-gray-400">Scalable</div>
				</div>
				<div className="glass-card p-4 text-center">
					<div className="text-2xl font-bold gradient-text animate-pulse">100%</div>
					<div className="text-xs text-gray-400">Automated</div>
				</div>
			</div>
		</div>
	);
};

export default InteractiveCommands;