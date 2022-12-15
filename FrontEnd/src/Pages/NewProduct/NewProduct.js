import { Crown, GalleryAdd } from "iconsax-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import "./newProduct.scss";
import axios from "./../../hooks/axios";
import { FilePond, registerPlugin } from "react-filepond";
import { toast } from "react-toastify";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
// Register the plugin
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { AuthContext } from "../../context/AuthContext";

// Register the plugins
registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginImageValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
);

const NewProduct = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [files, setFiles] = useState([]);
    const [brand, setBrand] = useState("");
    const [size, setSize] = useState("");
    const [sizes, setSizes] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [shop, setShop] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/shops/${user._id}`);
            setShop(data);
            setSubCategories(data.subCategories);
        };
        fetchData();
    }, [user]);

    const navigate = useNavigate();
    const handleCancle = () => {
        navigate("/seller");
    };
    const addsizeHandler = () => {
        if (sizes.find((s) => s === size)) {
            toast.warning("Size đã tồn tại trong sản phẩm");
            return;
        }
        setSizes((pre) => [...pre, size]);
        setSize("");
    };

    const checkProductNameExist = async () => {
        const { data } = await axios.get(`/products/shop/${shop._id}`);
        if (data) {
            if (data.find((p) => p.name === name)) {
                return true;
            }
        }
        return false;
    };

    const handleSubmit = async () => {
        console.log(await checkProductNameExist());
        if (await checkProductNameExist()) {
            toast.warning("Sản phẩm đã tồn tại trong cửa hàng");
            return;
        }
        const img = getImageData(files);
        try {
            await axios.post("/products", {
                name,
                shop: shop._id,
                quantity,
                price,
                brand,
                sizes,
                description,
                img,
                subCategory,
            });
            toast.success("Tạo sản phẩm thành công");
        } catch (err) {
            toast.error(err.message);
        }
    };
    const getImageData = (files) => {
        let rs = [];
        files.forEach((item) => {
            var imgData = `{"type":"${
                item.fileType.split(";")[0]
            }","data":"${item.getFileEncodeBase64String()}"}`;

            rs.push(imgData);
        });
        return rs;
    };
    return (
        <div>
            <Navbar style="seller" />
            <hr style={{ width: "100%", margin: 0 }} />
            <div className="newProduct">
                <span>Thêm sản phẩm</span>
                <div className="newProduct-box">
                    <span>Thông tin chi tiết</span>
                    <div className="newProduct-name">
                        <span>Tên sản phẩm</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="newProduct-brand">
                        <span>Thương hiệu</span>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            required
                        />
                    </div>
                    <div className="newProduct-size">
                        <span>Danh mục</span>
                        <div className="newProduct-sizeBox">
                            {subCategories.map((s) => (
                                <span
                                    key={s}
                                    onClick={() => setSubCategory(s)}
                                    style={{
                                        backgroundColor:
                                            s === subCategory
                                                ? "var(--sub-color)"
                                                : null,
                                        color:
                                            s === subCategory ? "#fff" : null,
                                        cursor: "pointer",
                                    }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="newProduct-size">
                        <span>Size</span>
                        <input
                            type="text"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            required
                        />
                        <button onClick={addsizeHandler}>Thêm</button>
                        <div className="newProduct-sizeBox">
                            {sizes.map((s) => (
                                <span key={s}>{s}</span>
                            ))}
                        </div>
                    </div>
                    <div className="newProduct-quantity">
                        <span>Số lượng sản phẩm trong kho hàng</span>
                        <div className="newProduct-quantityInput">
                            <input
                                type="number"
                                min={0}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="newProduct-price">
                        <span>Giá bán</span>
                        <div className="newProduct-priceBox">
                            <div className="newProduct-priceInput">
                                <input
                                    type="number"
                                    min={0}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                                <Crown variant="Bold" className="active" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="newProduct-img">
                        <span>Hình ảnh sản phẩm</span>
                        <div className="newProduct-imgBox">
                            <img src="../../Img/iphone14.png" alt="" />
                            <img src="../../Img/iphone14.png" alt="" />
                            <img src="../../Img/iphone14.png" alt="" />
                            <button>
                                <GalleryAdd />
                                Thêm hình ảnh
                            </button>
                        </div>
                    </div> */}
                    <div>
                        <span>Hình ảnh sản phẩm</span>
                        <FilePond
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={true}
                            maxFiles={3}
                            maxFileSize="3MB"
                            //server="/api"
                            name="img"
                            labelIdle="Thêm tối đa 3 ảnh cho sản phẩm"
                        />
                    </div>
                    <span>Mô tả sản phẩm</span>
                    <div className="newProduct-desc">
                        <span>Mô tả sản phẩm</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="newProduct-btn">
                        <button onClick={handleCancle}>Hủy</button>
                        <button onClick={handleSubmit}>Lưu</button>
                    </div>
                </div>
                <hr />
            </div>
            <Footer />
        </div>
    );
};

export default NewProduct;
