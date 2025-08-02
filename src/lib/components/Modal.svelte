<script lang="ts">
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { Confetti } from 'svelte-confetti';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title?: string;
		showConfetti?: boolean;
		children: Snippet;
	}

	let { isOpen = false, onClose, title, showConfetti, children }: Props = $props();

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal-overlay open"
		onclick={handleOverlayClick}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="modal-content">
			{#if title}
				<div class="modal-header">
					<h2>{title}</h2>
					<button class="modal-close" onclick={onClose} title="Close modal">
						<X size={20} />
					</button>
				</div>
			{/if}
			{#if showConfetti}
				<div class="confetti-container">
					<Confetti x={[-0.5, 0.5]} />
					<Confetti amount={15} x={[-0.75, -0.3]} y={[0.15, 0.75]} />
					<Confetti amount={15} x={[0.3, 0.75]} y={[0.15, 0.75]} />
				</div>
			{/if}
			<div class="modal-body">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	.confetti-container {
		width: 80%;
		display: flex;
		justify-content: end;
		z-index: 1000;
	}
</style>
