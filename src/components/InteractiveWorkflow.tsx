import React, { useState, useEffect } from 'react';

const InteractiveWorkflow: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [estimatedCost, setEstimatedCost] = useState(0);
	const [fundingProgress, setFundingProgress] = useState(0);
	const [issueCount, setIssueCount] = useState(0);
	const [aiTyping, setAiTyping] = useState('');
	const [showPayment, setShowPayment] = useState(false);

	const issues = [
		{ id: '#1234', title: 'Critical: Memory leak in production', severity: 'critical', estimate: 0 },
		{ id: '#1235', title: 'Feature: Add dark mode support', severity: 'feature', estimate: 0 },
		{ id: '#1236', title: 'Bug: Login button not responsive', severity: 'bug', estimate: 0 },
		{ id: '#1237', title: 'Enhancement: Improve API performance', severity: 'enhancement', estimate: 0 },
	];

	const aiMessages = [
		"🔍 Analyzing issue complexity...",
		"📊 Calculating implementation time...",
		"💰 Estimating fair compensation...",
		"🎯 Matching with qualified developers...",
		"✅ Ready for instant funding!"
	];

	const steps = [
		{ title: "Issue Detected", icon: "🐛", time: "0.1s" },
		{ title: "AI Analysis", icon: "🤖", time: "0.3s" },
		{ title: "Cost Estimation", icon: "💵", time: "0.2s" },
		{ title: "One-Click Fund", icon: "💳", time: "0.1s" },
		{ title: "Work Begins", icon: "⚡", time: "instant" },
	];

	useEffect(() => {
		const interval = setInterval(() => {
			if (!isRunning) {
				setIsRunning(true);
				runWorkflow();
			}
		}, 8000);

		// Start immediately
		if (!isRunning) {
			setIsRunning(true);
			runWorkflow();
		}

		return () => clearInterval(interval);
	}, []);

	const runWorkflow = async () => {
		// Reset
		setCurrentStep(0);
		setEstimatedCost(0);
		setFundingProgress(0);
		setIssueCount(0);
		setAiTyping('');
		setShowPayment(false);

		// Animate issue detection
		for (let i = 0; i < issues.length; i++) {
			await new Promise(resolve => setTimeout(resolve, 200));
			setIssueCount(i + 1);
		}

		// Step through workflow
		for (let i = 0; i < steps.length; i++) {
			await new Promise(resolve => setTimeout(resolve, 500));
			setCurrentStep(i + 1);

			// AI typing effect
			if (i === 1) {
				for (let j = 0; j < aiMessages.length; j++) {
					await typeMessage(aiMessages[j]);
					await new Promise(resolve => setTimeout(resolve, 300));
				}
			}

			// Show cost estimation
			if (i === 2) {
				await animateValue(0, 2500, 1000, setEstimatedCost);
			}

			// Show payment
			if (i === 3) {
				setShowPayment(true);
				await new Promise(resolve => setTimeout(resolve, 500));
				await animateValue(0, 100, 1500, setFundingProgress);
			}
		}

		await new Promise(resolve => setTimeout(resolve, 2000));
		setIsRunning(false);
	};

	const typeMessage = async (message: string) => {
		setAiTyping('');
		for (let i = 0; i <= message.length; i++) {
			await new Promise(resolve => setTimeout(resolve, 30));
			setAiTyping(message.slice(0, i));
		}
	};

	const animateValue = async (start: number, end: number, duration: number, setter: (val: number) => void) => {
		const startTime = Date.now();
		const update = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const value = start + (end - start) * easeOutQuad(progress);
			setter(Math.round(value));
			
			if (progress < 1) {
				requestAnimationFrame(update);
			}
		};
		requestAnimationFrame(update);
	};

	const easeOutQuad = (t: number) => t * (2 - t);

	return (
		<div className="interactive-workflow py-20 px-6 relative overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						<span className="gradient-text">Watch PRiority in Action</span>
					</h2>
					<p className="text-gray-400 text-lg">
						From issue to resolution in seconds, not months
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-12 items-start">
					{/* Left side - GitHub Issues */}
					<div className="space-y-4">
						<div className="glass-card p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-semibold flex items-center gap-2">
									<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
									</svg>
									GitHub Issues
								</h3>
								<span className="text-sm text-gray-400">
									{issueCount} issues detected
								</span>
							</div>

							<div className="space-y-3">
								{issues.map((issue, index) => (
									<div
										key={issue.id}
										className={`issue-card border border-gray-700 rounded-lg p-4 transition-all duration-500 ${
											index < issueCount 
												? 'opacity-100 translate-x-0' 
												: 'opacity-0 -translate-x-full'
										} ${currentStep >= 3 && index < issueCount ? 'border-green-500 bg-green-500/10' : ''}`}
										style={{ transitionDelay: `${index * 100}ms` }}
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-blue-400 font-mono text-sm">{issue.id}</span>
													<span className={`text-xs px-2 py-1 rounded-full ${
														issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
														issue.severity === 'bug' ? 'bg-orange-500/20 text-orange-400' :
														issue.severity === 'feature' ? 'bg-blue-500/20 text-blue-400' :
														'bg-purple-500/20 text-purple-400'
													}`}>
														{issue.severity}
													</span>
												</div>
												<p className="text-gray-300 text-sm">{issue.title}</p>
											</div>
											{currentStep >= 3 && index < issueCount && (
												<div className="text-right animate-fade-in">
													<div className="text-green-400 text-lg font-bold">
														${(2500 / 4).toFixed(0)}
													</div>
													<div className="text-xs text-gray-500">estimated</div>
												</div>
											)}
										</div>
										{currentStep >= 4 && index < issueCount && (
											<div className="mt-3 pt-3 border-t border-gray-700">
												<div className="flex items-center justify-between">
													<span className="text-xs text-gray-400">Funding Progress</span>
													<span className="text-xs text-green-400">{fundingProgress}%</span>
												</div>
												<div className="mt-1 h-2 bg-gray-700 rounded-full overflow-hidden">
													<div 
														className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000"
														style={{ width: `${fundingProgress}%` }}
													/>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right side - AI Workflow */}
					<div className="space-y-6">
						{/* Progress Steps */}
						<div className="glass-card p-6">
							<h3 className="text-xl font-semibold mb-4">AI Workflow</h3>
							<div className="space-y-3">
								{steps.map((step, index) => (
									<div
										key={index}
										className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
											currentStep > index 
												? 'bg-blue-500/20 border border-blue-500/50' 
												: 'bg-gray-800/50 border border-gray-700'
										}`}
									>
										<div className={`text-2xl transition-transform duration-500 ${
											currentStep > index ? 'scale-110 animate-pulse' : ''
										}`}>
											{step.icon}
										</div>
										<div className="flex-1">
											<div className="font-medium">{step.title}</div>
											<div className="text-xs text-gray-400">{step.time}</div>
										</div>
										{currentStep > index && (
											<svg className="w-5 h-5 text-green-400 animate-fade-in" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
											</svg>
										)}
									</div>
								))}
							</div>
						</div>

						{/* AI Terminal */}
						<div className="glass-card p-6 font-mono">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
								<div className="w-3 h-3 rounded-full bg-green-500"></div>
								<span className="text-xs text-gray-400 ml-2">AI Estimation Engine</span>
							</div>
							<div className="bg-black/50 rounded p-4 h-32 overflow-hidden">
								<div className="text-green-400 text-sm">
									{aiTyping && (
										<>
											<span className="text-gray-500">$</span> {aiTyping}
											<span className="animate-blink">_</span>
										</>
									)}
								</div>
								{currentStep >= 3 && (
									<div className="mt-2 text-blue-400 animate-fade-in">
										<div>Total Estimation: <span className="text-white font-bold">${estimatedCost}</span></div>
										<div className="text-xs text-gray-400 mt-1">Time to fix: ~4 hours</div>
									</div>
								)}
							</div>
						</div>

						{/* Payment UI - Always visible to prevent layout jumping */}
						<div className="glass-card p-6 transition-all duration-500">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold">One-Click Funding</h3>
								{showPayment && (
									<svg className="w-8 h-8 text-blue-400 animate-fade-in" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
									</svg>
								)}
							</div>
							<button className={`w-full text-lg py-4 font-semibold transition-all duration-500 ${
								showPayment 
									? 'glow-button cursor-pointer' 
									: 'bg-gray-800 border border-gray-700 cursor-not-allowed opacity-50'
							}`} disabled={!showPayment}>
								<span className="flex items-center justify-center gap-3">
									{showPayment ? (
										<>
											<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
											</svg>
											Funded with Stripe
											<span className="text-green-400">✓</span>
										</>
									) : (
										<>
											<svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
											</svg>
											Waiting for estimation...
										</>
									)}
								</span>
							</button>
							<p className="text-xs text-gray-400 text-center mt-2">
								{showPayment 
									? 'Transaction completed in 0.7 seconds' 
									: 'Secure payments with Stripe'
								}
							</p>
						</div>
					</div>
				</div>

				{/* Speed Metrics */}
				<div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="glass-card p-6 text-center">
						<div className="text-3xl font-bold gradient-text animate-pulse">0.7s</div>
						<div className="text-gray-400 text-sm mt-1">Estimation Time</div>
					</div>
					<div className="glass-card p-6 text-center">
						<div className="text-3xl font-bold gradient-text animate-pulse">1-Click</div>
						<div className="text-gray-400 text-sm mt-1">To Fund</div>
					</div>
					<div className="glass-card p-6 text-center">
						<div className="text-3xl font-bold gradient-text animate-pulse">4hrs</div>
						<div className="text-gray-400 text-sm mt-1">Avg Resolution</div>
					</div>
					<div className="glass-card p-6 text-center">
						<div className="text-3xl font-bold gradient-text animate-pulse">100%</div>
						<div className="text-gray-400 text-sm mt-1">Automated</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InteractiveWorkflow;