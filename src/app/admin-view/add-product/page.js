"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { addNewProduct, updateAProduct } from "@/services/product";
import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseConfig,
  firebaseStroageURL,
} from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resolve } from "styled-jsx/css";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStroageURL);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

async function helperForUPloadingImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
}

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};

export default function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialFormData);

  const {
    componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
  } = useContext(GlobalContext);

  console.log(currentUpdatedProduct);

  const router = useRouter();

  useEffect(() => {
    if (currentUpdatedProduct !== null) setFormData(currentUpdatedProduct);
  }, [currentUpdatedProduct]);

  async function handleImage(event) {
    const extractImageUrl = await helperForUPloadingImageToFirebase(
      event.target.files[0]
    );

    if (extractImageUrl !== "") {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  }

  function handleTileClick(getCurrentItem) {
    let cpySizes = [...formData.sizes];
    const index = cpySizes.findIndex((item) => item.id === getCurrentItem.id);

    if (index === -1) {
      cpySizes.push(getCurrentItem);
    } else {
      cpySizes = cpySizes.filter((item) => item.id !== getCurrentItem.id);
    }

    setFormData({
      ...formData,
      sizes: cpySizes,
    });
  }

  async function handleAddProduct() {
    setComponentLevelLoader({ loading: true, id: "" });
    const res =
      currentUpdatedProduct !== null
        ? await updateAProduct(formData)
        : await addNewProduct(formData);

    console.log(res);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setFormData(initialFormData);
      setCurrentUpdatedProduct(null)
      setTimeout(() => {
        router.push("/admin-view/all-products");
      }, 1000);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setFormData(initialFormData);
    }
  }

  console.log(formData);

  return (
    <div className="w-full mt-5 mr-0 ml-0 mb-0 relative">
    <div className="flex flex-col items-start justify-start p-10  bg-white rounded-xl relative">
      <div className="w-full mt-0 mr-0 ml-0 mb-0 space-y-8">
        {adminAddProductformControls.map((controlItem) =>
          controlItem.componentType === "input" ? (
            <InputComponent
              type={controlItem.type}
              placeholder={controlItem.placeholder}
              label={controlItem.label}
              value={formData[controlItem.id]}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  [controlItem.id]: event.target.value,
                });
              }}
            />
          ) : controlItem.componentType === "select" ? (
            <SelectComponent
              label={controlItem.label}
              options={controlItem.options}
              value={formData[controlItem.id]}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  [controlItem.id]: event.target.value,
                });
              }}
            />
          ) : null
        )}

        <div className="flex gap-2 flex-col">
          <label className=" font-bold text-gray-600">Upload Image : </label>
          <input
            className="block w-full p-2 text-lg text-gray-100 border border-gray-900 rounded-lg cursor-pointer bg-black focus:bg-slate-900 shadow-lg "
            type="file"
            accept="image/*"
            max="1000000"
            onChange={handleImage}
          />
          <label className=" font-bold text-gray-600">
            Available Sizes :{" "}
          </label>
          <TileComponent
            data={AvailableSizes}
            onClick={handleTileClick}
            selected={formData.sizes}
          />
        </div>

        <button
          onClick={handleAddProduct}
          className=" inline-flex w-full items-center justify-center bg-black px-6 py-4 text-white text-lg font-medium uppercase tracking-wide"
        >
          {
              componentLevelLoader && componentLevelLoader.loading ? 
              (
                <ComponentLevelLoader
                  text={ currentUpdatedProduct !== null ? 'Updating Product' : "Adding Product"}
                  color={"#FFFFFF"}
                  loading={componentLevelLoader && componentLevelLoader.loading}
                />
            ) 
            : (
                currentUpdatedProduct !== null 
                ? 'Update Product' 
                : "Add Product"
              )
          }
        </button>
      </div>
    </div>
    <Notification />
  </div>
  );
}
