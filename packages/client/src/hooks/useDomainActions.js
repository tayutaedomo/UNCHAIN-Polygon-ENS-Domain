import { useState, useCallback } from "react";
import { ethers } from "ethers";
import contractAbi from "../utils/Domains.json";
import { CONTRACT_ADDRESS } from "../constants";

const useDomainActions = (currentAccount) => {
  const [loading, setLoading] = useState(false);
  const [mints, setMints] = useState([]);
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");

  const fetchMints = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );
        const names = await contract.getAllNames();
        const mintRecords = await Promise.all(
          names.map(async (name) => {
            const record = await contract.records(name);
            const owner = await contract.domains(name);
            return { id: names.indexOf(name), name, record, owner };
          })
        );
        console.log("Mints fetched", mintRecords);
        setMints(mintRecords);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const mintDomain = useCallback(async () => {
    if (!domain) {
      return;
    }

    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }

    const price =
      domain.length === 3 ? "0.005" : domain.length === 4 ? "0.003" : "0.001";
    console.log("Minting domain", domain, "for price", price);

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        const tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        });
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          const tx2 = await contract.setRecord(domain, record);
          await tx2.wait();

          console.log(
            "Record set! https://mumbai.polygonscan.com/tx/" + tx2.hash
          );

          setTimeout(() => {
            fetchMints();
          }, 2000);

          setDomain("");
          setRecord("");
        } else {
          alert("Transaction failed! Plase try again.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [domain, record, fetchMints]);

  const updateDomain = useCallback(async () => {
    if (!record || !domain) {
      return;
    }

    setLoading(true);
    console.log("Updating domain", domain, "with record", record);

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        const tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

        fetchMints();
        setDomain("");
        setRecord("");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, [domain, record, fetchMints]);

  return {
    fetchMints,
    mintDomain,
    updateDomain,
    loading,
    mints,
    domain,
    setDomain,
    record,
    setRecord,
  };
};

export default useDomainActions;
