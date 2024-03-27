import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

export default function Footer() {
	return (
		<footer>
			<div>
				<input placeholder="Message GPT..."></input>
                <IconButton
					icon={<ArrowUpIcon />}
					aria-label="Send Message"
					variant="solid"
                    bg={"brand.300"}
				/>
			</div>
		</footer>
	);
}
