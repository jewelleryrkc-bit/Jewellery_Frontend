/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PRODUCT } from "../../../../graphql/mutations";
import { GET_PARENT_CATEGORIES, ME_QUERY, GET_SUBCATEGORIES } from "../../../../graphql/queries";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import AnotherHeader from "../../../../components/anotherheader";
import Footer from "../../../../components/Footer";

type Variation = {
  size: string;
  color: string;
  price: number;
  stock: number;
};

type AddProductFormInputs = {
  name: string;
  description: string;
  price: number;
  stock: number;
  material: string;
  size: string;
  weight: string;
  category: string;
  subcategory: string;
  brand: string;
  style: string;
  type: string;
  upc: string;
  color: string;
  mainStoneColor: string;
  department: string;
  metal: string;
  diamondColorGrade: string;
  mainStoneShape: string;
  mainStoneTreatment: string;
  settingStyle: string;
  country: string;
  itemLength: string;
  mainStoneCreation: string;
  totalCaratWeight: string;
  baseMetal: string;
  numberOfDiamonds: string;
  shape: string;
  theme: string;
  chainType: string;
  closure: string;
  charmType: string;
  features: string[];
  personalized: string;
  personalizeInstruction: string;
  mpn: string;
  signed: string;
  vintage: string;
  wholesale: string;
  variations?: Variation[];
};

const colors = ['Beige', 'Black', 'Blue', 'Brown', 'Clear', 'Gold', 'Gray', 'Green', 'Ivory', 'Multi', 'Orange', 'Pink', 'Purple', 'Red', 'Silver', 'White', 'Yellow'];
const mainStoneColors = ['Aqua', 'Canary', 'Champagne', 'Choco', 'Cream', 'Lavender', 'Turquoise', ...colors];
const departments = ['Boys', 'Girls', 'Unisex baby & toddler', 'Unisex kids'];
const metals = ['Aluminium', 'Brass', 'Brass plated', 'Bronze', 'Chrome', 'Cobalt', 'Copper', 'Fine silver', 'Iron', 'Multi tone gold plated', 'Nickel', 'Palladium', 'Palladium-plated', 'Platinum', 'Platinum-plated', 'Rhodium', 'Rhodium-plated', 'Rose gold', 'Rose gold filled', 'Rose gold plated', 'Silver', 'Silver-plated', 'Stainless steel', 'Sterling silver', 'Titanium', 'Titanium plated', 'Unknown', 'White gold', 'White gold filled', 'White gold plated', 'Yellow gold', 'Yellow gold filled', 'Yellow gold plated'];
const diamondColorGrades = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const mainStoneShapes = ['Asscher', 'Baguette', 'Brilliant cut', 'Butterfly', 'Cabochon', 'Chip', 'Clover', 'Cushion', 'Emerald', 'Heart', 'Marquise', 'Oval', 'Pear', 'Princess', 'Radiant cut', 'Rose cut', 'Round', 'Square', 'Star', 'Teardrop', 'Trapezoid', 'Trillion'];
const mainStoneTreatments = ['Bleached', 'Clarity enhanced', 'Diffused', 'Dyed', 'Filled', 'Heated', 'Heated and pressure treated', 'Impregnated', 'Irradiated', 'Laser treated', 'Not enhanced', 'Stabilized', 'Surface coated', 'Unknown'];
const settingStyles = ['Halo', 'Bar', 'Bezel', 'Channel set', 'Cluster', 'Flush', 'Pave', 'Prong', 'Solitaire', 'Tension'];
const countries = ['United States', 'China', 'India', 'Italy', 'Thailand', 'Turkey', 'Other'];
const itemLengths = Array.from({length: 6}, (_, i) => `${5 + i} in`);
const mainStoneCreations = ['Cultured', 'Lab-created', 'Natural', 'Simulated', 'Unknown'];
const shapes = ['Asymmetrical', 'Bow', 'Butterfly', 'Clover', 'Cone', 'Cross', 'Flower', 'Heart', 'Hexagon', 'Horseshoe', 'Knot', 'Leaf', 'Moon', 'Octagon', 'Oval', 'Rectangle', 'Round', 'Snowflake', 'Square', 'Star', 'Teardrop', 'Triangle'];
const themes = ['Art', 'Beauty', 'Ethnic', 'Fairy tale & fantasy', 'Fashion costumes', 'Flowers and plants', 'Love', 'Angels', 'Animals and insects', 'Anime', 'Awareness', 'Birds', 'Bohemian', 'Cartoon', 'Celestial & fictional characters', 'Horoscope', 'Coins and money', 'Colleges and universities', 'Flags and political', 'Food and drink', 'Fruits and vegetables', 'Gadgets and tech', 'Halloween', 'Healing', 'Hip hop', 'Hobby and craft', 'Home and garden', 'Letters numbers and words', 'Luck', 'Magic', 'Memorial', 'Music and dance', 'Nature', 'Religious', 'Sports', 'Toys and games'];
const chainTypes = ['Anchor/Mariner', 'Ball/Bead', 'Bar link', 'Book', 'Box', 'Braided', 'Byzantine', 'Cable', 'Caprice', 'Cord', 'Crisscross', 'Cuban link', 'Cup chain', 'Curb link', 'Figaro', 'Figure 8', 'Foxtail', 'Herringbone', 'Marquise', 'Mesh', 'Omega', 'Oval link', 'Panther', 'Popcorn', 'Rolo', 'Rope', 'Round link', 'San Marco', 'Serpentine', 'Singapore', 'Snake', 'Spiga/Wheat', 'Tube', 'Venetian link', 'Wire'];
const closures = ['Ball', 'Barrel', 'Bolo', 'Box', 'Buckle', 'Hook', 'Lobster', 'Magnetic', 'Padlock', 'Push lock', 'Slide', 'Snap', 'Spring ring', 'Tie', 'Toggle', 'Tumlock'];
const charmTypes = ['Bead', 'Clip', 'Dangle', 'European', 'Floating', 'Italian modular', 'Locket', 'Slide', 'Snap', 'Spacer', 'Traditional'];
const features = ['Adjustable', 'Engraved', 'Magnetic', 'Nickel-free', 'Reversible', 'Stackable'];

export default function AddProduct() {
  const [addProduct] = useMutation(CREATE_PRODUCT);
  const { data: cdata, loading: cloading } = useQuery(ME_QUERY);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PARENT_CATEGORIES);
  const [errorMessage, setErrorMessage] = useState("");
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const featuresString = selectedFeatures.join(', ');

  useEffect(() => {
    if (!cloading && (!cdata || !cdata.me)) {
      redirect("/");
    }
  }, [cdata, cloading]);

  const { data: subcategoriesData, loading: subcategoriesLoading } = useQuery(GET_SUBCATEGORIES, {
    variables: { parentCategoryId: selectedParentCategory },
    skip: !selectedParentCategory,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormInputs>();

  const addVariation = () => {
    setVariations([...variations, { size: "", color: "", price: 0, stock: 0 }]);
  };

  const updateVariation = (index: number, field: keyof Variation, value: string | number) => {
    setVariations((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]: field === "price" || field === "stock" 
                ? Number(value) 
                : String(value),
            }
          : v
      )
    );
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const onSubmit = async (data: AddProductFormInputs) => {
    // Validate variations
    for (const [index, variation] of variations.entries()) {
      if (!variation.size || !variation.color || variation.price <= 0 || variation.stock <= 0) {
        setErrorMessage(`Please fill all fields for variation #${index + 1}`);
        return;
      }
    }

    // Validate main product price/stock
    if (data.price <= 0 || isNaN(data.price)) {
      setErrorMessage("Price must be a positive number");
      return;
    }

    if (data.stock <= 0 || isNaN(data.stock)) {
      setErrorMessage("Stock must be a positive number");
      return;
    }

    try {
      const response = await addProduct({
        variables: {
          input: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            material: data.material,
            size: data.size,
            weight: data.weight,
            category: data.category,
            subcategory: data.subcategory,
            brand: data.brand,
            style: data.style,
            type: data.type,
            upc: data.upc,
            color: data.color,
            mainStoneColor: data.mainStoneColor,
            department: data.department,
            metal: data.metal,
            diamondColorGrade: data.diamondColorGrade,
            mainStoneShape: data.mainStoneShape,
            mainStoneTreatment: data.mainStoneTreatment,
            settingStyle: data.settingStyle,
            country: data.country,
            itemLength: data.itemLength,
            mainStoneCreation: data.mainStoneCreation,
            totalCaratWeight: data.totalCaratWeight,
            baseMetal: data.baseMetal,
            numberOfDiamonds: data.numberOfDiamonds,
            shape: data.shape,
            theme: data.theme,
            chainType: data.chainType,
            closure: data.closure,
            charmType: data.charmType,
            features: featuresString,
            personalized: data.personalized,
            personalizeInstruction: data.personalizeInstruction,
            mpn: data.mpn,
            signed: data.signed,
            vintage: data.vintage,
            wholesale: data.wholesale,
            variations: variations.map(v => ({
              size: v.size,
              color: v.color,
              price: v.price,
              stock: v.stock
            }))
          },
        },
      });

      if (response.data?.createProduct?.id) {
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(response.data?.createProduct?.errors?.[0]?.message || "Error creating product");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage("An error occurred while creating the product");
    }
  };

  return (
  <>
   <AnotherHeader />
<div className="h-px w-5/6 mx-auto bg-gray-200 my-6" />
<div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Item Specifics</h2>
  {errorMessage && (
    <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{errorMessage}</p>
  )}

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
    {/* Photos Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Photos</h3>
      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p>Drag & drop product images here</p>
        <p className="text-sm text-gray-400 mt-1">or click to browse</p>
      </div>
    </div>

    {/* Title Section */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        placeholder="e.g., 925 Sterling Silver Ring/Size 6.5"
        {...register("name", { required: "Title is required" })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
      )}
    </div>

    {/* Category Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            {...register("category", { required: "Category is required" })}
            onChange={(e) => setSelectedParentCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select a Category</option>
            {categoriesLoading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categoriesData?.parentCategories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedParentCategory && (
          <div>
            <select
              {...register("subcategory", { required: "Subcategory is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select a Subcategory</option>
              {subcategoriesLoading ? (
                <option disabled>Loading subcategories...</option>
              ) : (
                subcategoriesData?.subcategories?.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))
              )}
            </select>
          </div>
        )}
      </div>
    </div>

    {/* Brand Section */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Brand</label>
      <input
        type="text"
        placeholder="Enter brand name"
        {...register("brand")}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
    </div>

    {/* Style and Type Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <select
          {...register("style")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Style</option>
          <option value="Bangle">Bangle</option>
          <option value="Beaded">Beaded</option>
          <option value="Chain">Chain</option>
          <option value="Charm">Charm</option>
          <option value="Cuff">Cuff</option>
          <option value="Identity">Identity</option>
          <option value="Tennis">Tennis</option>
          <option value="Wrap">Wrap</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register("type")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Type</option>
          <option value="Bracelet">Bracelet</option>
          <option value="Charm">Charm</option>
        </select>
      </div>
    </div>

    {/* UPC Section */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">UPC</label>
      <input
        type="text"
        placeholder="Enter UPC code"
        {...register("upc")}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
    </div>

    {/* Color and Main Stone Color Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <select
          {...register("color")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Color</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Main Stone Color
        </label>
        <select
          {...register("mainStoneColor")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Main Stone Color</option>
          {mainStoneColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Department and Metal Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          {...register("department")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Metal</label>
        <select
          {...register("metal")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Metal</option>
          {metals.map((metal) => (
            <option key={metal} value={metal}>
              {metal}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Diamond Color Grade and Main Stone Shape Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Diamond Color Grade
        </label>
        <select
          {...register("diamondColorGrade")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Diamond Color Grade</option>
          {diamondColorGrades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Main Stone Shape
        </label>
        <select
          {...register("mainStoneShape")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Main Stone Shape</option>
          {mainStoneShapes.map((shape) => (
            <option key={shape} value={shape}>
              {shape}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Main Stone Treatment and Setting Style Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Main Stone Treatment
        </label>
        <select
          {...register("mainStoneTreatment")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Main Stone Treatment</option>
          {mainStoneTreatments.map((treatment) => (
            <option key={treatment} value={treatment}>
              {treatment}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Setting Style
        </label>
        <select
          {...register("settingStyle")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Setting Style</option>
          {settingStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Country and Item Length Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <select
          {...register("country")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Item Length
        </label>
        <select
          {...register("itemLength")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Item Length</option>
          {itemLengths.map((length) => (
            <option key={length} value={length}>
              {length}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Main Stone Creation and Total Carat Weight Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Main Stone Creation
        </label>
        <select
          {...register("mainStoneCreation")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Main Stone Creation</option>
          {mainStoneCreations.map((creation) => (
            <option key={creation} value={creation}>
              {creation}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Total Carat Weight
        </label>
        <input
          type="text"
          placeholder="Enter total carat weight"
          {...register("totalCaratWeight")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
    </div>

    {/* Base Metal and Number of Diamonds Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Base Metal
        </label>
        <select
          {...register("baseMetal")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Base Metal</option>
          {metals.map((metal) => (
            <option key={metal} value={metal}>
              {metal}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Number of Diamonds
        </label>
        <input
          type="text"
          placeholder="Enter number of diamonds"
          {...register("numberOfDiamonds")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
    </div>

    {/* Shape and Theme Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Shape</label>
        <select
          {...register("shape")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Shape</option>
          {shapes.map((shape) => (
            <option key={shape} value={shape}>
              {shape}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Theme</label>
        <select
          {...register("theme")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Theme</option>
          {themes.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Chain Type and Closure Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Chain Type
        </label>
        <select
          {...register("chainType")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Chain Type</option>
          {chainTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Closure
        </label>
        <select
          {...register("closure")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select Closure</option>
          {closures.map((closure) => (
            <option key={closure} value={closure}>
              {closure}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Charm Type Section */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Charm Type
      </label>
      <select
        {...register("charmType")}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      >
        <option value="">Select Charm Type</option>
        {charmTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {/* Features Section */}
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Features</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center">
            <input
              type="checkbox"
              id={`feature-${feature}`}
              checked={selectedFeatures.includes(feature)}
              onChange={() => toggleFeature(feature)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`feature-${feature}`}
              className="ml-2 text-sm text-gray-700"
            >
              {feature}
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Personalization Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Personalized
        </label>
        <select
          {...register("personalized")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Personalize Instruction
        </label>
        <input
          type="text"
          placeholder="Enter personalization instructions"
          {...register("personalizeInstruction")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
    </div>

    {/* MPN and Signed/Vintage/Wholesale Section */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1 md:col-span-2 space-y-2">
        <label className="block text-sm font-medium text-gray-700">MPN</label>
        <input
          type="text"
          placeholder="Manufacturer Part Number"
          {...register("mpn")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Signed</label>
        <select
          {...register("signed")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Vintage</label>
        <select
          {...register("vintage")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Wholesale
        </label>
        <select
          {...register("wholesale")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>

    {/* Item Specifics Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Item Specifics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <input
            type="text"
            placeholder="Material"
            {...register("material", { required: "Material is required" })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {errors.material && (
            <p className="text-red-500 text-sm mt-1">{errors.material.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <input
            type="text"
            placeholder="Size"
            {...register("size", { required: "Size is required" })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {errors.size && (
            <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Weight (optional)
          </label>
          <input
            type="text"
            placeholder="Weight (optional)"
            {...register("weight")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              className="pl-7 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            placeholder="Stock"
            {...register("stock", {
              required: "Stock is required",
              valueAsNumber: true,
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>
      </div>
    </div>

    {/* Description Section */}
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-700">Description</h3>
      <textarea
        rows={6}
        placeholder="Write a detailed description of your item."
        {...register("description", { required: "Description is required" })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
      )}
    </div>

    {/* Variations Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Variations</h3>
      {variations.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-500">
            <div className="col-span-3">Size</div>
            <div className="col-span-3">Color</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-2">Action</div>
          </div>
          {variations.map((variation, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg"
            >
              <div className="col-span-3">
                <input
                  type="text"
                  placeholder="Size"
                  value={variation.size}
                  onChange={(e) =>
                    updateVariation(index, "size", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  placeholder="Color"
                  value={variation.color}
                  onChange={(e) =>
                    updateVariation(index, "color", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={variation.price || ""}
                  onChange={(e) =>
                    updateVariation(index, "price", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Stock"
                  value={variation.stock || ""}
                  onChange={(e) =>
                    updateVariation(index, "stock", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => removeVariation(index)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={addVariation}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Variation
      </button>
    </div>

    {/* Submit Button */}
    <div className="pt-6">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "List Item"
        )}
      </button>
    </div>
  </form>
</div>
<Footer />
    </>
  );
}