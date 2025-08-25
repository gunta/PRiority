import React from 'react';
import { GitHubDark, Gemini, ClaudeAI, Stripe, OpenAIDark, CursorDark } from '@ridemountainpig/svgl-react';

const TechLogos: React.FC = () => {
	const logos = [
		{ name: 'github', label: 'GitHub', component: GitHubDark },
		// { name: 'github-actions', label: 'GitHub Actions', component: GitHubDark },
		{ name: 'stripe', label: 'Stripe', component: Stripe },
		{ name: 'claude', label: 'Claude Code', component: ClaudeAI },
		{ name: 'google-gemini', label: 'Gemini CLI', component: Gemini },
		{ name: 'openai', label: 'Codex', component: OpenAIDark },
		{ name: 'cursor', label: 'Cursor Agents', component: CursorDark },
	];

	return (
		<section className="tech-logos-section py-20 px-6 relative overflow-hidden">
			<div 
				className="absolute inset-0 pointer-events-none"
				style={{
					background: 'radial-gradient(circle at 50% 50%, rgba(102, 179, 255, 0.05) 0%, transparent 70%)'
				}}
			/>
			
			<div className="max-w-6xl mx-auto relative z-10">
				<div className="text-center mb-12">
					<h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-300">
						Powered by AI, Built for Developers
					</h3>
					<p className="text-gray-500 text-lg">
						Integrates with cutting-edge AI coding assistants and developer tools
					</p>
				</div>
				
				<div className="grid grid-cols-3 md:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center max-w-4xl mx-auto">
					{logos.map((logo) => (
						<div
							key={logo.name}
							className="logo-item flex flex-col items-center gap-3 opacity-100 transition-all duration-300 saturate-150 hover:opacity-100 hover:-translate-y-1 group cursor-default"
						>
							<div className="w-16 h-16 md:w-20 md:h-20 transition-all duration-300 group-hover:scale-110 filter hover:saturate-200 group-hover:grayscale-0 group-hover:drop-shadow-[0_0_20px_rgba(102,179,255,0.4)]">
								<logo.component
									size={80}
									className="w-full h-full"
								/>
							</div>
							<span className="text-[10px] md:text-xs text-gray-600 group-hover:text-gray-400 font-medium tracking-wide transition-colors duration-300">
								{logo.label}
							</span>
						</div>
					))}
				</div>
				
				<div className="mt-12 text-center">
					<p className="text-gray-600 text-sm md:text-base">
						Ready for the tools you already use
					</p>
				</div>
			</div>
		</section>
	);
};

export default TechLogos;