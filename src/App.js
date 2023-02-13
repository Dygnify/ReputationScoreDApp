import { useEffect, useState } from "react";
import AvailableWallets from "./Components/Modals/AvailableWallets/AvailableWallets";
import "./App.css";
import Charts from "./Components/Charts/Charts";
import Button from "./Components/Button/Button";
import dygnify_logo from "./Images/dygnify_logo.png";
import Loader from "./Components/Loader/Loader";
const user =
	"https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021061/user-logo_w8yfph.jpg";

function App() {
	const [isLoader, setIsLoader] = useState(false);
	const [loaderDisplayed, setLoaderDisplayed] = useState(false);
	const [availableWalletModalOpen, setAvailableWalletModalOpen] =
		useState(false);
	const [availableWallets, setAvailableWallets] = useState([
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo1_q4lugd.png",
			name: "MetaMask",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			primary: true,
			score: 905,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021059/logo2_o2yqhd.png",
			name: "WalletConnect",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			primary: false,
			score: 700,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo6_xhcxav.png",
			name: "Coinbase",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			primary: false,
			score: 650,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo4_wxtljw.jpg",
			name: "Magic Wallet",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			primary: false,
			score: 805,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo5_kxostt.png",
			name: "Portis",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			primary: false,
			score: 907,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo7_a5agqf.png",
			name: "Torus",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			primary: false,
			score: 700,
		},
	]);
	const [connectedWallet, setConnectedWallet] = useState({
		logo: user,
		name: "",
		id: "",
	});

	if (isLoader) {
		setTimeout(() => {
			setIsLoader(false);
			setLoaderDisplayed(true);
		}, 7000);
	}

	const [selected, setSelected] = useState(false);
	useEffect(() => {
		for (let wallet of availableWallets) {
			if (wallet.selected === true) {
				setConnectedWallet({ ...wallet });
				setSelected(true);
				break;
			}
		}
	}, [availableWallets]);

	return (
		<div>
			{isLoader && <Loader />}

			<div className="reputation-header">
				<img src={dygnify_logo} alt="" />
			</div>
			<div
				className={`${
					availableWalletModalOpen || isLoader
						? "blockpass-package-my-blur"
						: ""
				} reputation-body`}
			>
				<section style={{ width: "70%" }}>
					<section className="repu-card blockpass-package-macro-wallet-status">
						{!selected && (
							<div className="status-info">
								<img
									src={user}
									alt=""
									className="blockpass-package-default-logo"
								/>
								<p>
									<span>Wallet not connected</span>
									<span
										onClick={() =>
											setAvailableWalletModalOpen(true)
										}
										style={{ cursor: "pointer" }}
										className="blockpass-package-wallet-connect"
									>
										Connect wallet
									</span>
								</p>
							</div>
						)}
						{availableWallets
							.filter((wallet) => wallet.selected === true)
							.map((wallet, i) => (
								<div key={i} className="status-info">
									<img
										src={wallet.logo}
										alt=""
										className="blockpass-package-default-logo"
									/>
									<p>
										<span>{wallet.name}</span>
										<span className="blockpass-package-wallet-connect">
											{wallet.id}
										</span>
									</p>
								</div>
							))}
					</section>
					<br />
					<section className="blockpass-package-flex-center button-group">
						<Button
							onClick={() => setAvailableWalletModalOpen(true)}
						>
							{selected ? "+ Add more wallet" : "Connect Wallet"}
						</Button>
						<Button
							onClick={() => setIsLoader(true)}
							disabled={!selected}
						>
							Get Credit Score
						</Button>
					</section>

					<section className="repu-card blockpass-package-macro-wallet-card-container">
						<h3 className="text-center blockpass-package-gray-header">
							Reputation Score
						</h3>
						<div className="blockpass-package-macro-wallet-card">
							<div className="blockpass-package-graph-card blockpass-package-flex-center">
								<p>On Chain</p>
								<Charts
									connectedWallet={connectedWallet}
									loaderDisplayed={loaderDisplayed}
								/>
							</div>
							<div className="blockpass-package-graph-card blockpass-package-flex-center">
								<p>Off Chain</p>
								<Charts
									connectedWallet={connectedWallet}
									loaderDisplayed={loaderDisplayed}
								/>
							</div>
						</div>
					</section>
					<section className="repu-card blockpass-package-flex-center button-group bottom-buttons">
						<Button disabled={!loaderDisplayed} width="35%">
							Claim Reputation Score
						</Button>
						<Button disabled={!loaderDisplayed} width="35%">
							Create NFC
						</Button>
					</section>
				</section>

				<section
					className="repu-card blockpass-package-right-side"
					style={{ width: "30%" }}
				>
					<h4 className="blockpass-package-gray-header">
						What is Karma Score?
					</h4>
					<p className="reputation-intro-first-block">
						The <span>"Karma Score"</span> scoring system is unique
						in that it incorporates both the organization's on-chain
						and off-chain behaviour.
					</p>
					<h4 className="blockpass-package-gray-header">
						Reputation off &nbsp;The Chain
					</h4>
					<p>
						We determine the score by considering bureau reports,
						any external ratings, proprietary financial information,
						and other publicly accessible real-world data.
					</p>
					<h4 className="blockpass-package-gray-header">
						Reputation on The Chain
					</h4>
					<p>
						We analyse the wallet transactions, block explorer data,
						and other information from web 3 sources to determine
						the score.
					</p>
					<h4 className="blockpass-package-gray-header">
						Score of Reputation
					</h4>
					<p>
						The two scores are averaged together to create the
						result. Customizable weights are provided.
					</p>
				</section>
			</div>
			{availableWalletModalOpen && (
				<AvailableWallets
					setAvailableWalletModalOpen={setAvailableWalletModalOpen}
					availableWallets={availableWallets}
					setAvailableWallets={setAvailableWallets}
				/>
			)}
		</div>
	);
}

export default App;
