import { useEffect, useState } from "react";
import AvailableWallets from "./Components/Modals/AvailableWallets/AvailableWallets";
import "./App.css";
import Charts from "./Components/Charts/Charts";
import Button from "./Components/Button/Button";
import Loader from "./Components/Loader/Loader";
import VideoCard from "./Components/VideoCard/VideoCard";
import PlayButton from "./Components/Button/PlayButton";
import { getCreditScore } from "./services/data-points";
import { mintNFC } from "./services/nfcConnector";
import { sendNotification } from "./services/pushNotification"
import InfoModal from "./Components/Modals/InfoModal/InfoModal";
import karma_score from "./Images/karma_score.png";
//import { QRCode } from "react-qr-svg";

const data = {
	id: "c811849d-6bfb-4d85-936e-3d9759c7f105",
	typ: "application/iden3comm-plain-json",
	type: "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
	body: {
		transaction_data: {
			contract_address: "0x439a2A7E5bf91d6dAd804873F83a528F78Ac424F",
			method_id: "b68967e2",
			chain_id: 80001,
			network: "polygon-mumbai",
		},
		reason: "karma score",
		scope: [
			{
				id: 1,
				circuit_id: "credentialAtomicQuerySig",
				rules: {
					query: {
						allowed_issuers: ["*"],
						req: { OnChainScore: { $gt: 0 } },
						schema: {
							url: "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/564b804d-f8c1-4fac-a424-b39ae9c5ce4c.json-ld",
							type: "Holistic Reputation Score",
						},
					},
				},
			},
		],
	},
};

const user =
	"https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021061/user-logo_w8yfph.jpg";

function App() {
	const [isLoader, setIsLoader] = useState(false);
	const [isClickedClaim, setIsClickedClaim] = useState(false);
	const [creditLoaderDisplayed, setCreditLoaderDisplayed] = useState(false);
	const [selected, setSelected] = useState(false);
	const [availableWalletModalOpen, setAvailableWalletModalOpen] =
		useState(false);
	const [isVideoOpen, setIsVideoOpen] = useState(false);
	const [offChainScore, setoffChainScore] = useState(0);
	const [onChainScore, setOnChainScore] = useState(0);
	const [isModal, setIsModal] = useState(false);
	const [isInfoModalMsg, setIsInfoModalMsg] = useState("");
	const [availableWallets, setAvailableWallets] = useState([
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo1_q4lugd.png",
			name: "MetaMask",
			id: "0",
			selected: false,
			score: 905,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676298745/ProfilePic_1_c1ghhg.svg",
			name: "CoinDcx",
			id: "dny****ar@gmail.com",
			selected: false,
			score: 700,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676298651/kucoin-cryptocurrency-stock-market-logo-isolated-white-background-crypto-stock-exchange-symbol-design-element-banners_337410-1692_uurpka.jpg",
			name: "KuCoin",
			id: "dn**@**.com",
			selected: false,
			score: 700,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021059/logo2_o2yqhd.png",
			name: "WalletConnect",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			score: 700,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo6_xhcxav.png",
			name: "Coinbase",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			score: 650,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo4_wxtljw.jpg",
			name: "Magic Wallet",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			score: 805,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo5_kxostt.png",
			name: "Portis",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			score: 907,
		},
		{
			logo: "https://res.cloudinary.com/dltzp2gwx/image/upload/v1676021060/logo7_a5agqf.png",
			name: "Torus",
			id: "0xc5e5be3602995a7f0bd737e0931d776a0bcc336f",
			selected: false,
			score: 700,
		},
	]);

	useEffect(() => {
		if (isLoader) {
			setTimeout(() => {
				setIsLoader(false);
				setCreditLoaderDisplayed(true);
			}, 7000);
		}
	}, [isLoader, creditLoaderDisplayed]);

	const nfcHandler = async () => {
		setIsModal(true);
		const nfcData = await mintNFC();
		console.log(nfcData);
		if (nfcData.success) {
			setIsInfoModalMsg(nfcData.msg);
		} else {
			if (nfcData.msg.includes("user rejected transaction")) {
				setIsInfoModalMsg("User rejected transaction");
			} else {
				setIsInfoModalMsg(nfcData.msg);
			}
		}
	};

	useEffect(() => {
		for (let wallet of availableWallets) {
			if (wallet.selected === true) {
				setSelected(true);
				break;
			}
		}
		setIsClickedClaim(false);
	}, [availableWallets, creditLoaderDisplayed]);

	const openInNewTab = (url) => {
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const fetchCreditScore = async () => {
		setIsLoader(true);
		setoffChainScore(713);
		let score = await getCreditScore(

			"0xdad4c11e8cc6a5c37808d3b31b3b284809f702d1"

		);
		setOnChainScore(score);
		sendNotification(
			window.ethereum.selectedAddress,
			"Your Karma score is generated Successfully",
			`Your offChain score is 713 and onChain score is ${score}`
		);
	};

	return (
		<div>
			<div className={`${isLoader && "video-my-blur"}`}>
				{isLoader && <Loader />}
			</div>

			<header className="reputation-header">
				<img src={karma_score} alt="" />
				<PlayButton
					onClick={setIsVideoOpen}
					className="header-button"
				/>
			</header>
			<main
				className={`${
					availableWalletModalOpen || isLoader || isVideoOpen
						? "blockpass-package-my-blur"
						: ""
					} reputation-body`}
			>
				<section className="blockpass-package-left-side">
					<section className="repu-card blockpass-package-macro-wallet-status">
						{!selected && (
							<div className="status-info">
								<img
									src={user}
									alt=""
									className="blockpass-package-default-logo"
								/>
								<p className="connected-wallet-info">
									<span>Wallet not connected</span>
									<span
										onClick={() =>
											setAvailableWalletModalOpen(true)
										}
										style={{ cursor: "pointer" }}
										className="connected-wallet-id"
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
									<p className="connected-wallet-info">
										<span>{wallet.name}</span>
										<span className="connected-wallet-id" title={`${wallet.id}`}>
											{wallet.id}
										</span>
									</p>
								</div>
							))}
					</section>
					<br />
					<section className="blockpass-package-flex-center button-group upper-buttons">
						<Button
							onClick={() => setAvailableWalletModalOpen(true)}
							className="upper-button"
						>
							{selected ? "+ Add more wallet" : "Connect Wallet"}
						</Button>
						<Button
							onClick={fetchCreditScore}
							disabled={!selected}
							className="upper-button"
						>
							Get Karma Score
						</Button>
					</section>

					<section className="repu-card blockpass-package-macro-wallet-card-container">
						<h3 className="text-center blockpass-package-gray-header">
							Karma Score
						</h3>
						<div className="blockpass-package-macro-wallet-card">
							<div className="blockpass-package-graph-card blockpass-package-flex-center">
								<p>Off Chain</p>
								<Charts
									chainScore={offChainScore}
									creditLoaderDisplayed={
										creditLoaderDisplayed
									}
								/>
							</div>

							<div className="blockpass-package-graph-card blockpass-package-flex-center">
								<p>On Chain</p>
								<Charts
									chainScore={onChainScore}
									creditLoaderDisplayed={
										creditLoaderDisplayed
									}
								/>
							</div>
						</div>
					</section>
					<section className="repu-card blockpass-package-flex-center button-group bottom-buttons">
						<Button
							onClick={() => {
								openInNewTab("https://platform-test.polygonid.com/claim-link/da8b473d-663c-46cd-9271-1a463a8bd500");
								setIsClickedClaim(true);
							}}
							className="bottom-button"
							disabled={!creditLoaderDisplayed}
						>
							Claim Karma Score
						</Button>
						<Button
							disabled={!creditLoaderDisplayed}
							onClick={nfcHandler}
							className="bottom-button"
						>
							Create NFC
						</Button>
					</section>

					{/* {isClickedClaim && creditLoaderDisplayed && (
						<section className="blockpass-package-flex-center repu-card qrcode-container">
							<h3>Verify Your claim and get Karma Score NFC</h3>
							<QRCode
								level="Q"
								style={{ width: 256 }}
								value={JSON.stringify(data)}
							/>
						</section>
					)} */}
				</section>

				<section className="repu-card blockpass-package-right-side">
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
						liquidation, NFTs and other information from web 3
						sources to determine the score.
					</p>
					<h4 className="blockpass-package-gray-header">
						Score of Reputation
					</h4>
					<p>
						The scores are provided to the DeFi Dapps who can then
						use those as per their needs.
					</p>
				</section>
			</main>
			{availableWalletModalOpen && (
				<AvailableWallets
					setAvailableWalletModalOpen={setAvailableWalletModalOpen}
					availableWallets={availableWallets}
					setAvailableWallets={setAvailableWallets}
					setCreditLoaderDisplayed={setCreditLoaderDisplayed}
				/>
			)}

			{isVideoOpen && (
				<VideoCard
					setAvailableWalletModalOpen={setAvailableWalletModalOpen}
					availableWallets={availableWallets}
					setIsVideoOpen={setIsVideoOpen}
				/>
			)}

			{isModal && (
				<InfoModal
					setIsModal={setIsModal}
					isInfoModalMsg={isInfoModalMsg}
					setIsInfoModalMsg={setIsInfoModalMsg}
				/>
			)}
		</div>
	);
}

export default App;
