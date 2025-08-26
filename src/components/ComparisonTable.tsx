import React from 'react';
import { motion } from 'framer-motion';

interface ComparisonItem {
  name: string;
  status: 'failed' | 'limited' | 'active';
  infrastructure: string;
  funding: string;
  estimation: string;
  execution: string;
  control: string;
  weakness: string;
}

const comparisons: ComparisonItem[] = [
  {
    name: "BountySource",
    status: "failed",
    infrastructure: "External platform",
    funding: "Escrow system",
    estimation: "Manual only",
    execution: "None",
    control: "Platform-owned",
    weakness: "Shut down 2023, $2M lost"
  },
  {
    name: "IssueHunt",
    status: "limited",
    infrastructure: "External platform",
    funding: "Requires account",
    estimation: "Manual only",
    execution: "None",
    control: "Platform-owned",
    weakness: "High fees, <1% adoption"
  },
  {
    name: "Gitcoin",
    status: "limited",
    infrastructure: "Blockchain",
    funding: "Crypto only",
    estimation: "Manual only",
    execution: "None",
    control: "DAO governance",
    weakness: "Complex, volatile, high friction"
  },
  {
    name: "GitHub Sponsors",
    status: "active",
    infrastructure: "GitHub native",
    funding: "Monthly subs",
    estimation: "N/A",
    execution: "None",
    control: "Creator-owned",
    weakness: "Not issue-specific"
  },
  {
    name: "Consulting",
    status: "active",
    infrastructure: "Manual process",
    funding: "Invoicing",
    estimation: "Meetings",
    execution: "Human only",
    control: "Contract-based",
    weakness: "Slow, expensive, high overhead"
  },
  {
    name: "PRiority",
    status: "active",
    infrastructure: "GitHub Actions",
    funding: "Direct payment",
    estimation: "AI-powered",
    execution: "AI agents",
    control: "Repo-owned",
    weakness: "None - built different ✨"
  }
];

export default function ComparisonTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'failed':
        return 'text-red-400';
      case 'limited':
        return 'text-yellow-400';
      case 'active':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'failed':
        return '❌ Failed';
      case 'limited':
        return '⚠️ Limited';
      case 'active':
        return '✅ Active';
      default:
        return status;
    }
  };

  return (
    <section className="relative px-4 py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
              Why Others Failed
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Every solution before PRiority had fatal flaws. We learned from their mistakes and built different.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">Platform</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">Infrastructure</th>
                  <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Funding</th>
                  <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">AI Estimation</th>
                  <th className="text-left p-4 text-gray-400 font-medium hidden xl:table-cell">AI Execution</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Fatal Flaw</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, index) => (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-white/5 ${
                      item.name === 'PRiority' ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">
                        {item.name}
                        {item.name === 'PRiority' && (
                          <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                        {getStatusBadge(item.status)}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-gray-400 text-sm">
                      {item.infrastructure}
                    </td>
                    <td className="p-4 hidden md:table-cell text-gray-400 text-sm">
                      {item.funding}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className={item.estimation === 'AI-powered' ? 'text-green-400' : 'text-gray-500'}>
                        {item.estimation === 'AI-powered' ? '✅ Yes' : '❌ No'}
                      </span>
                    </td>
                    <td className="p-4 hidden xl:table-cell">
                      <span className={item.execution === 'AI agents' ? 'text-green-400' : 'text-gray-500'}>
                        {item.execution === 'AI agents' ? '✅ Yes' : '❌ No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm ${item.name === 'PRiority' ? 'text-green-400 font-medium' : 'text-red-400/80'}`}>
                        {item.weakness}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-red-400 mb-3">The Platform Risk</h3>
            <p className="text-gray-400 text-sm">
              External platforms can shut down, taking your money with them. BountySource proved this isn't theoretical - it happened.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">The Friction Problem</h3>
            <p className="text-gray-400 text-sm">
              Requiring external accounts, crypto wallets, or complex onboarding kills adoption. If it's not one-click, it's too much.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-3">The PRiority Way</h3>
            <p className="text-gray-400 text-sm">
              GitHub-native, AI-powered, repo-owned. No platform risk, no friction, just results. Built on what works, avoiding what doesn't.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}