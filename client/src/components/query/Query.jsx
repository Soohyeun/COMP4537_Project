import ChatContainer from "./ChatContainer";
import Footer from "./Footer";

export default function Query() {
	return (
		<div>
			<header>
				<h1>QueriGPT</h1>
			</header>
			<main>
				<ChatContainer
					remainingQueryCount={19}
					query="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
					response="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
					deleteChat={() => console.log("Chat deleted!")}
				/>
				<ChatContainer
					remainingQueryCount={18}
					query="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
					response="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
					do eiusmod tempor incididunt ut labore et dolore magna
					aliqua. Augue eget arcu dictum varius duis at consectetur.
					Suspendisse in est ante in nibh mauris cursus. Interdum
					velit laoreet id donec ultrices tincidunt arcu non sodales.
					Sit amet porttitor eget dolor morbi non arcu. Ullamcorper
					dignissim cras tincidunt lobortis feugiat vivamus. Ultrices
					tincidunt arcu non sodales. Nunc congue nisi vitae suscipit
					tellus mauris a. Massa sed elementum tempus egestas sed.
					Morbi tristique senectus et netus et. Adipiscing elit duis
					tristique sollicitudin. Tortor posuere ac ut consequat
					semper viverra. Aliquam etiam erat velit scelerisque in
					dictum non consectetur. Diam sit amet nisl suscipit
					adipiscing bibendum est. Aliquet nibh praesent tristique
					magna sit amet purus. Interdum velit euismod in pellentesque
					massa placerat duis ultricies. Tortor aliquam nulla facilisi
					cras fermentum odio eu. Viverra nam libero justo laoreet.
					Massa placerat duis ultricies lacus. Sem viverra aliquet
					eget sit amet tellus cras adipiscing. Pretium fusce id velit
					ut tortor pretium. Habitant morbi tristique senectus et
					netus et malesuada. Tellus id interdum velit laoreet id
					donec. Pellentesque habitant morbi tristique senectus et
					netus. Aenean et tortor at risus. Fringilla phasellus
					faucibus scelerisque eleifend. Suspendisse faucibus interdum
					posuere lorem ipsum dolor sit amet. Est pellentesque elit
					ullamcorper dignissim cras tincidunt lobortis. Euismod in
					pellentesque massa placerat duis ultricies lacus sed turpis.
					Pellentesque eu tincidunt tortor aliquam nulla facilisi.
					Aenean pharetra magna ac placerat. Dignissim cras tincidunt
					lobortis feugiat vivamus at. Rhoncus aenean vel elit
					scelerisque mauris. Non blandit massa enim nec dui nunc
					mattis enim. Ullamcorper sit amet risus nullam eget felis
					eget nunc lobortis. Senectus et netus et malesuada fames ac
					turpis. Proin libero nunc consequat interdum varius sit.
					Morbi tristique senectus et netus et malesuada. Pretium nibh
					ipsum consequat nisl vel pretium lectus. Aliquam nulla
					facilisi cras fermentum. Neque ornare aenean euismod
					elementum nisi quis eleifend quam adipiscing. Molestie a
					iaculis at erat pellentesque adipiscing commodo elit at.
					Varius sit amet mattis vulputate enim. Donec ac odio tempor
					orci dapibus ultrices in iaculis nunc. Urna id volutpat
					lacus laoreet non curabitur gravida. Nisi lacus sed viverra
					tellus in hac habitasse platea dictumst. Erat pellentesque
					adipiscing commodo elit at imperdiet dui accumsan. Tristique
					senectus et netus et malesuada fames ac. Odio tempor orci
					dapibus ultrices in iaculis nunc sed augue. Justo nec
					ultrices dui sapien eget. Suspendisse in est ante in nibh
					mauris cursus mattis. Elit pellentesque habitant morbi
					tristique senectus et netus. Condimentum lacinia quis vel
					eros donec ac odio tempor orci. Posuere urna nec tincidunt
					praesent semper feugiat nibh sed. Amet nisl purus in mollis
					nunc. Cursus risus at ultrices mi tempus imperdiet nulla
					malesuada. Feugiat vivamus at augue eget arcu dictum. Vel
					pharetra vel turpis nunc eget lorem dolor. Quam nulla
					porttitor massa id neque aliquam. Quisque sagittis purus sit
					amet."
					deleteChat={() => console.log("Chat deleted!")}
				/>
			</main>
			<Footer />
		</div>
	);
}
