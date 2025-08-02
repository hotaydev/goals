<script lang="ts">
	import { CheckSquare, ArrowLeft } from '@lucide/svelte';
</script>

<div class="page-container">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<div class="header-top">
				<a href="/" class="btn btn-icon">
					<ArrowLeft size={20} />
				</a>
				<h1>Tasks Board</h1>
			</div>
			<p>Manage and organize your tasks in a comprehensive board view</p>
		</div>
	</div>

	<!-- Placeholder Content -->
	<div class="placeholder-content">
		<div class="placeholder-icon">
			<CheckSquare size={64} />
		</div>
		<h3>Tasks Board Coming Soon</h3>
		<p>
			This view will provide a comprehensive board interface for managing all your tasks across
			different goals.
		</p>
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-lg);
	}

	.header-content {
		flex: 1;
	}

	.header-top {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-sm);
	}

	.header-content h1 {
		margin: 0;
	}

	.header-content p {
		margin: 0;
	}

	.placeholder-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--spacing-2xl);
		gap: var(--spacing-md);
		margin-top: calc(var(--spacing-2xl) * 2);
	}

	.placeholder-icon {
		opacity: 0.5;
		color: var(--color-text-secondary);
	}

	.placeholder-content h3 {
		margin: 0;
		color: var(--color-text-primary);
	}

	.placeholder-content p {
		margin: 0;
		max-width: 400px;
		color: var(--color-text-secondary);
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
