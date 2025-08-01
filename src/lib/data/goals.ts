import type { Goal } from '../models/types';

// Mock data for testing the application
export const mockGoals: Goal[] = [
	{
		id: '1',
		title: 'Learn Full-Stack Development',
		description: 'Master modern web development technologies to build complete applications',
		icon: '🎯',
		targetDate: {
			year: 2029,
			month: 12
		},
		smart: {
			specific:
				'Learn modern web development technologies including frontend frameworks, backend systems, and databases',
			measurable: 'Complete 5 major projects and obtain 3 relevant certifications',
			achievable:
				'Dedicate 2 hours daily to learning and practice, leverage online courses and documentation',
			relevant: 'Essential for career growth in technology and building personal projects',
			timeBound: 'Complete by December 2029 with quarterly milestone reviews'
		},
		milestones: [
			{
				id: '1-1',
				title: 'Master Frontend Technologies',
				description: 'Learn modern frontend frameworks and tools',
				icon: '⚛️',
				value: 'high',
				effort: 'high',
				smart: {
					specific: 'Learn React, Svelte, TypeScript, and modern CSS frameworks',
					measurable: 'Build 3 frontend projects and complete certification',
					achievable: 'Follow structured courses and practice daily',
					relevant: 'Frontend skills are essential for modern web development',
					timeBound: 'Complete by June 2025'
				},
				tasks: [
					{
						id: '1-1-1',
						title: 'Complete React Fundamentals Course',
						description: 'Learn React basics including components, state, and hooks',
						icon: '⚛️',
						status: 'done',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Complete comprehensive React course covering modern patterns',
							measurable: 'Finish all course modules and pass final assessment',
							achievable: 'Dedicate 1 hour daily for 4 weeks',
							relevant: 'React is widely used in the industry',
							timeBound: 'Complete by March 2024'
						},
						createdAt: new Date('2024-01-15'),
						updatedAt: new Date('2024-03-15')
					},
					{
						id: '1-1-2',
						title: 'Learn TypeScript',
						description: 'Master TypeScript for type-safe JavaScript development',
						icon: '🔷',
						status: 'in_progress',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Learn TypeScript syntax, types, interfaces, and generics',
							measurable: 'Convert 2 JavaScript projects to TypeScript',
							achievable: 'Study official docs and practice with real projects',
							relevant: 'TypeScript improves code quality and developer experience',
							timeBound: 'Complete by April 2024'
						},
						createdAt: new Date('2024-02-01'),
						updatedAt: new Date('2024-03-20')
					},
					{
						id: '1-1-3',
						title: 'Build Portfolio Website',
						description: 'Create a personal portfolio showcasing frontend skills',
						icon: '🌐',
						status: 'planned',
						value: 'high',
						effort: 'high',
						smart: {
							specific:
								'Build responsive portfolio with React/Svelte, animations, and modern design',
							measurable: 'Deploy live site with 5+ project showcases',
							achievable: 'Use learned skills and design inspiration',
							relevant: 'Portfolio demonstrates skills to potential employers',
							timeBound: 'Complete by May 2024'
						},
						createdAt: new Date('2024-03-01'),
						updatedAt: new Date('2024-03-01')
					}
				],
				createdAt: new Date('2024-01-15'),
				updatedAt: new Date('2024-03-20')
			},
			{
				id: '1-2',
				title: 'Backend Development Mastery',
				description: 'Learn server-side technologies and APIs',
				icon: '🔧',
				value: 'high',
				effort: 'high',
				smart: {
					specific: 'Learn Node.js, Python, databases, and API development',
					measurable: 'Build 2 backend projects with full CRUD operations',
					achievable: 'Follow tutorials and build progressively complex projects',
					relevant: 'Backend skills complete full-stack capabilities',
					timeBound: 'Complete by December 2025'
				},
				tasks: [
					{
						id: '1-2-1',
						title: 'Learn Node.js and Express',
						description: 'Master backend JavaScript development',
						icon: '🟢',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Learn Node.js runtime, Express framework, and middleware',
							measurable: 'Build REST API with authentication and validation',
							achievable: 'Follow official guides and best practices',
							relevant: 'Node.js allows using JavaScript for full-stack development',
							timeBound: 'Complete by July 2024'
						},
						createdAt: new Date('2024-04-01'),
						updatedAt: new Date('2024-04-01')
					},
					{
						id: '1-2-2',
						title: 'Database Design and Management',
						description: 'Learn SQL and NoSQL database technologies',
						icon: '🗄️',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Learn PostgreSQL, MongoDB, and database design principles',
							measurable: 'Design and implement 3 different database schemas',
							achievable: 'Practice with real-world scenarios and optimization',
							relevant: 'Data persistence is crucial for all applications',
							timeBound: 'Complete by September 2024'
						},
						createdAt: new Date('2024-05-01'),
						updatedAt: new Date('2024-05-01')
					}
				],
				createdAt: new Date('2024-04-01'),
				updatedAt: new Date('2024-04-01')
			},
			{
				id: '1-3',
				title: 'DevOps and Deployment',
				description: 'Learn deployment, CI/CD, and cloud technologies',
				icon: '☁️',
				value: 'low',
				effort: 'high',
				smart: {
					specific: 'Learn Docker, AWS/Vercel, CI/CD pipelines, and monitoring',
					measurable: 'Deploy 3 applications with automated pipelines',
					achievable: 'Start with simple deployments and add complexity',
					relevant: 'DevOps skills are essential for production applications',
					timeBound: 'Complete by June 2026'
				},
				tasks: [
					{
						id: '1-3-1',
						title: 'Learn Docker Containerization',
						description: 'Master container technology for consistent deployments',
						icon: '🐳',
						status: 'planned',
						value: 'low',
						effort: 'low',
						smart: {
							specific: 'Learn Docker basics, Dockerfile creation, and container orchestration',
							measurable: 'Containerize 2 applications successfully',
							achievable: 'Follow Docker tutorials and best practices',
							relevant: 'Containers solve deployment consistency issues',
							timeBound: 'Complete by January 2025'
						},
						createdAt: new Date('2024-10-01'),
						updatedAt: new Date('2024-10-01')
					}
				],
				createdAt: new Date('2024-10-01'),
				updatedAt: new Date('2024-10-01')
			}
		],
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-01-15')
	},
	{
		id: '2',
		title: 'Read 50 Technical Books',
		description: 'Expand knowledge through systematic technical reading',
		icon: '📚',
		targetDate: {
			year: 2028,
			month: 12
		},
		smart: {
			specific:
				'Read 50 books covering software engineering, system design, and professional development',
			measurable: 'Track books completed, take notes, and write summary for each book',
			achievable: 'Read 1 book per month with 30 minutes daily reading sessions',
			relevant: 'Builds foundational knowledge and keeps up with industry trends',
			timeBound: 'Complete 50 books by December 2028'
		},
		milestones: [
			{
				id: '2-1',
				title: 'Software Engineering Fundamentals',
				description: 'Read foundational books on software engineering principles',
				icon: '🏗️',
				value: 'high',
				effort: 'low',
				smart: {
					specific: 'Read 15 books covering clean code, design patterns, and architecture',
					measurable: 'Complete book summaries and apply concepts in projects',
					achievable: 'Read during commute and dedicated evening time',
					relevant: 'Core principles that improve code quality',
					timeBound: 'Complete 15 books by December 2025'
				},
				tasks: [
					{
						id: '2-1-1',
						title: 'Read "Clean Code" by Robert Martin',
						description: 'Master principles of writing maintainable code',
						icon: '🧹',
						status: 'done',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Read and understand clean code principles and practices',
							measurable: 'Complete all chapters and write detailed summary',
							achievable: 'Read 2 chapters per week for 8 weeks',
							relevant: 'Clean code principles are fundamental to good development',
							timeBound: 'Complete by March 2024'
						},
						createdAt: new Date('2024-02-01'),
						updatedAt: new Date('2024-03-15')
					},
					{
						id: '2-1-2',
						title: 'Read "Design Patterns" by Gang of Four',
						description: 'Learn common software design patterns',
						icon: '🔧',
						status: 'in_progress',
						value: 'high',
						effort: 'high',
						smart: {
							specific: 'Study 23 classic design patterns and their applications',
							measurable: 'Implement 5 patterns in practice projects',
							achievable: 'Read one pattern per week with hands-on practice',
							relevant: 'Design patterns solve common programming problems',
							timeBound: 'Complete by June 2024'
						},
						createdAt: new Date('2024-03-01'),
						updatedAt: new Date('2024-03-20')
					},
					{
						id: '2-1-3',
						title: 'Read "System Design Interview" by Alex Xu',
						description: 'Learn how to design scalable systems',
						icon: '🏛️',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Study system design principles and real-world examples',
							measurable: 'Practice designing 10 different systems',
							achievable: 'Read case studies and practice with online resources',
							relevant: 'System design skills are crucial for senior roles',
							timeBound: 'Complete by August 2024'
						},
						createdAt: new Date('2024-04-01'),
						updatedAt: new Date('2024-04-01')
					}
				],
				createdAt: new Date('2024-02-01'),
				updatedAt: new Date('2024-03-20')
			},
			{
				id: '2-2',
				title: 'Advanced Technical Topics',
				description:
					'Explore specialized areas like algorithms, databases, and distributed systems',
				icon: '🧠',
				value: 'high',
				effort: 'high',
				smart: {
					specific: 'Read 20 books on algorithms, databases, distributed systems, and performance',
					measurable: 'Implement key algorithms and concepts in practice',
					achievable: 'Focus on practical application while reading theory',
					relevant: 'Advanced knowledge differentiates senior engineers',
					timeBound: 'Complete 20 books by December 2027'
				},
				tasks: [
					{
						id: '2-2-1',
						title: 'Read "Designing Data-Intensive Applications"',
						description: 'Deep dive into modern data systems and architectures',
						icon: '📊',
						status: 'planned',
						value: 'high',
						effort: 'high',
						smart: {
							specific: 'Study data storage, retrieval, and processing at scale',
							measurable: 'Complete all chapters and build sample data pipeline',
							achievable: 'Read consistently and implement concepts',
							relevant: 'Data systems are core to modern applications',
							timeBound: 'Complete by December 2024'
						},
						createdAt: new Date('2024-08-01'),
						updatedAt: new Date('2024-08-01')
					}
				],
				createdAt: new Date('2024-08-01'),
				updatedAt: new Date('2024-08-01')
			},
			{
				id: '2-3',
				title: 'Leadership and Career Development',
				description: 'Read books on technical leadership and career growth',
				icon: '👥',
				value: 'low',
				effort: 'low',
				smart: {
					specific: 'Read 15 books on leadership, communication, and career advancement',
					measurable: 'Apply leadership concepts in team projects',
					achievable: 'Balance with technical reading for well-rounded growth',
					relevant: 'Leadership skills are essential for career progression',
					timeBound: 'Complete 15 books by December 2028'
				},
				tasks: [
					{
						id: '2-3-1',
						title: 'Read "The Manager\'s Path" by Camille Fournier',
						description: 'Learn about technical leadership and management',
						icon: '🛤️',
						status: 'planned',
						value: 'low',
						effort: 'low',
						smart: {
							specific: 'Study the progression from engineer to technical leader',
							measurable: 'Complete all chapters and create leadership plan',
							achievable: 'Read during breaks and apply concepts gradually',
							relevant: 'Understanding leadership path helps career planning',
							timeBound: 'Complete by March 2025'
						},
						createdAt: new Date('2025-01-01'),
						updatedAt: new Date('2025-01-01')
					}
				],
				createdAt: new Date('2025-01-01'),
				updatedAt: new Date('2025-01-01')
			}
		],
		createdAt: new Date('2024-02-01'),
		updatedAt: new Date('2024-02-01')
	},
	{
		id: '3',
		title: 'Build a SaaS Product',
		description: 'Create and launch a successful Software as a Service product',
		icon: '🚀',
		targetDate: {
			year: 2027,
			month: 6,
			day: 30
		},
		smart: {
			specific: 'Build, launch, and scale a SaaS product that solves a real problem',
			measurable: 'Achieve 100 paying customers and $10,000 monthly recurring revenue',
			achievable: 'Leverage existing skills, start with MVP, iterate based on feedback',
			relevant: 'Provides entrepreneurial experience and potential financial independence',
			timeBound: 'Launch MVP by June 2027, reach targets by June 2028'
		},
		milestones: [
			{
				id: '3-1',
				title: 'Market Research and Validation',
				description: 'Identify problem, target market, and validate product idea',
				icon: '🔍',
				value: 'high',
				effort: 'low',
				smart: {
					specific: 'Research market needs, competitor analysis, and customer interviews',
					measurable: 'Interview 50 potential customers and validate problem exists',
					achievable: 'Use online surveys, interviews, and market research tools',
					relevant: 'Validation prevents building products nobody wants',
					timeBound: 'Complete market research by September 2024'
				},
				tasks: [
					{
						id: '3-1-1',
						title: 'Conduct Problem Discovery Research',
						description: 'Identify real problems that potential customers face',
						icon: '❓',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Interview 25 people in target market about their pain points',
							measurable: 'Document 10 validated problems with market size estimates',
							achievable: 'Use network and online communities for interviews',
							relevant: 'Understanding real problems is foundation of successful products',
							timeBound: 'Complete by June 2024'
						},
						createdAt: new Date('2024-03-10'),
						updatedAt: new Date('2024-03-10')
					},
					{
						id: '3-1-2',
						title: 'Analyze Competition and Market Size',
						description: 'Research existing solutions and market opportunity',
						icon: '📊',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Analyze top 10 competitors and estimate total addressable market',
							measurable: 'Create competitive analysis report and market size estimate',
							achievable: 'Use online tools, reports, and competitor websites',
							relevant: 'Understanding competition helps position product effectively',
							timeBound: 'Complete by July 2024'
						},
						createdAt: new Date('2024-04-01'),
						updatedAt: new Date('2024-04-01')
					},
					{
						id: '3-1-3',
						title: 'Create Product Concept and Validate',
						description: 'Define product concept and get customer feedback',
						icon: '💡',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Create product concept, wireframes, and validate with potential customers',
							measurable: 'Get positive feedback from 70% of 25 interviewed customers',
							achievable: 'Use design tools and customer feedback sessions',
							relevant: 'Early validation reduces risk of building wrong product',
							timeBound: 'Complete validation by August 2024'
						},
						createdAt: new Date('2024-05-01'),
						updatedAt: new Date('2024-05-01')
					}
				],
				createdAt: new Date('2024-03-10'),
				updatedAt: new Date('2024-03-10')
			},
			{
				id: '3-2',
				title: 'MVP Development',
				description: 'Build minimum viable product with core features',
				icon: '⚙️',
				value: 'high',
				effort: 'high',
				smart: {
					specific: 'Develop core features that solve the main customer problem',
					measurable: 'Launch functional product with 3-5 key features',
					achievable: 'Use modern tech stack and focus on essential features only',
					relevant: 'MVP allows early customer feedback and faster iteration',
					timeBound: 'Complete MVP development by March 2025'
				},
				tasks: [
					{
						id: '3-2-1',
						title: 'Design System Architecture',
						description: 'Plan technical architecture for scalable product',
						icon: '🏗️',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Design database schema, API structure, and deployment architecture',
							measurable: 'Complete technical specification document',
							achievable: 'Use proven patterns and cloud-native approaches',
							relevant: 'Good architecture enables rapid development and scaling',
							timeBound: 'Complete architecture by October 2024'
						},
						createdAt: new Date('2024-09-01'),
						updatedAt: new Date('2024-09-01')
					},
					{
						id: '3-2-2',
						title: 'Implement Core Features',
						description: 'Build the essential product functionality',
						icon: '🔨',
						status: 'planned',
						value: 'high',
						effort: 'high',
						smart: {
							specific: 'Implement user authentication, core workflow, and basic dashboard',
							measurable: 'Complete 5 key user stories with full functionality',
							achievable: 'Work 10 hours per week consistently on development',
							relevant: 'Core features demonstrate product value to early users',
							timeBound: 'Complete core features by January 2025'
						},
						createdAt: new Date('2024-10-01'),
						updatedAt: new Date('2024-10-01')
					},
					{
						id: '3-2-3',
						title: 'Implement Payment and Billing',
						description: 'Add subscription management and payment processing',
						icon: '💳',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Integrate Stripe for subscriptions, billing, and payment management',
							measurable: 'Complete payment flow with 3 subscription tiers',
							achievable: 'Use Stripe APIs and follow security best practices',
							relevant: 'Payment system is essential for SaaS revenue model',
							timeBound: 'Complete billing system by February 2025'
						},
						createdAt: new Date('2024-12-01'),
						updatedAt: new Date('2024-12-01')
					}
				],
				createdAt: new Date('2024-09-01'),
				updatedAt: new Date('2024-09-01')
			},
			{
				id: '3-3',
				title: 'Launch and Growth',
				description: 'Launch product publicly and focus on customer acquisition',
				icon: '📈',
				value: 'high',
				effort: 'high',
				smart: {
					specific: 'Launch product, implement marketing strategies, and optimize for growth',
					measurable: 'Acquire 100 paying customers and reach $10k MRR',
					achievable: 'Use content marketing, partnerships, and customer referrals',
					relevant: 'Growth validates product-market fit and business viability',
					timeBound: 'Reach growth targets by June 2027'
				},
				tasks: [
					{
						id: '3-3-1',
						title: 'Launch Beta Program',
						description: 'Get early users to test and provide feedback',
						icon: '🧪',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Recruit 20 beta users to test product and provide feedback',
							measurable: 'Complete beta testing with 80% user satisfaction',
							achievable: 'Use personal network and online communities for recruitment',
							relevant: 'Beta testing helps identify issues before public launch',
							timeBound: 'Complete beta program by April 2025'
						},
						createdAt: new Date('2025-03-01'),
						updatedAt: new Date('2025-03-01')
					},
					{
						id: '3-3-2',
						title: 'Public Product Launch',
						description: 'Launch product publicly with marketing campaign',
						icon: '🎉',
						status: 'planned',
						value: 'high',
						effort: 'low',
						smart: {
							specific: 'Launch on Product Hunt, social media, and relevant communities',
							measurable: 'Achieve 1000 website visitors and 50 signups on launch day',
							achievable: 'Prepare marketing materials and coordinate launch activities',
							relevant: 'Public launch creates awareness and initial customer base',
							timeBound: 'Execute launch by June 2025'
						},
						createdAt: new Date('2025-05-01'),
						updatedAt: new Date('2025-05-01')
					},
					{
						id: '3-3-3',
						title: 'Implement Growth Marketing',
						description: 'Execute marketing strategies to acquire customers',
						icon: '📢',
						status: 'planned',
						value: 'low',
						effort: 'high',
						smart: {
							specific: 'Content marketing, SEO, partnerships, and referral programs',
							measurable: 'Achieve 20% month-over-month customer growth',
							achievable: 'Focus on 2-3 marketing channels and optimize continuously',
							relevant: 'Consistent marketing is essential for sustainable growth',
							timeBound: 'Scale to 100 customers by December 2026'
						},
						createdAt: new Date('2025-06-01'),
						updatedAt: new Date('2025-06-01')
					}
				],
				createdAt: new Date('2025-03-01'),
				updatedAt: new Date('2025-03-01')
			}
		],
		createdAt: new Date('2024-03-10'),
		updatedAt: new Date('2024-03-10')
	}
];

// Helper function to get mock data (simulating API call)
export function getMockGoals(): Promise<Goal[]> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockGoals);
		}, 100);
	});
}
