// Product data
const products = [
    {
        id: 1,
        name: "Classic Round",
        category: "prescription",
        shape: "round",
        price: 129.99,
        description: "Timeless round frames that complement any face shape. These lightweight glasses provide all-day comfort and durability.",
        features: [
            "Lightweight acetate frame",
            "Anti-scratch coating",
            "UV protection",
            "Spring hinges for comfort"
        ],
        colors: ["Black", "Tortoise", "Crystal"],
        images: [
            "https://placehold.co/600x400?text=Classic+Round",
            "https://placehold.co/600x400?text=Classic+Round+Side",
            "https://placehold.co/600x400?text=Classic+Round+Angle"
        ],
        rating: 4.8,
        reviews: 124,
        featured: true
    },
    {
        id: 2,
        name: "Modern Square",
        category: "prescription",
        shape: "square",
        price: 149.99,
        description: "Bold square frames with a contemporary twist. Perfect for those looking to make a statement with their eyewear.",
        features: [
            "Premium acetate frame",
            "Blue light filtering",
            "Anti-reflective coating",
            "Reinforced hinges"
        ],
        colors: ["Black", "Navy", "Burgundy"],
        images: [
            "https://placehold.co/600x400?text=Modern+Square",
            "https://placehold.co/600x400?text=Modern+Square+Side",
            "https://placehold.co/600x400?text=Modern+Square+Angle"
        ],
        rating: 4.6,
        reviews: 98,
        featured: true
    },
    {
        id: 3,
        name: "Aviator Sunglasses",
        category: "sunglasses",
        shape: "aviator",
        price: 179.99,
        description: "Classic aviator sunglasses with polarized lenses. Protect your eyes in style with these timeless frames.",
        features: [
            "Metal frame",
            "Polarized lenses",
            "100% UV protection",
            "Adjustable nose pads"
        ],
        colors: ["Gold/Green", "Silver/Blue", "Black/Gray"],
        images: [
            "https://placehold.co/600x400?text=Aviator+Sunglasses",
            "https://placehold.co/600x400?text=Aviator+Side",
            "https://placehold.co/600x400?text=Aviator+Angle"
        ],
        rating: 4.9,
        reviews: 215,
        featured: true
    },
    {
        id: 4,
        name: "Cat Eye Classic",
        category: "prescription",
        shape: "cat-eye",
        price: 139.99,
        description: "Elegant cat eye frames that add a touch of vintage glamour to any outfit. These frames are both stylish and comfortable.",
        features: [
            "Acetate frame",
            "Anti-scratch coating",
            "Spring hinges",
            "Suitable for progressive lenses"
        ],
        colors: ["Black", "Tortoise", "Red"],
        images: [
            "https://placehold.co/600x400?text=Cat+Eye+Classic",
            "https://placehold.co/600x400?text=Cat+Eye+Side",
            "https://placehold.co/600x400?text=Cat+Eye+Angle"
        ],
        rating: 4.7,
        reviews: 87,
        featured: true
    },
    {
        id: 5,
        name: "Rectangle Readers",
        category: "reading",
        shape: "rectangle",
        price: 59.99,
        description: "Comfortable reading glasses with rectangle frames. Available in multiple strengths to suit your needs.",
        features: [
            "Lightweight frame",
            "Spring hinges",
            "Multiple strengths available",
            "Includes case"
        ],
        colors: ["Black", "Brown", "Blue"],
        images: [
            "https://placehold.co/600x400?text=Rectangle+Readers",
            "https://placehold.co/600x400?text=Readers+Side",
            "https://placehold.co/600x400?text=Readers+Angle"
        ],
        rating: 4.5,
        reviews: 62,
        featured: false
    },
    {
        id: 6,
        name: "Computer Blue Light",
        category: "computer",
        shape: "rectangle",
        price: 89.99,
        description: "Protect your eyes from digital strain with these blue light filtering glasses. Perfect for long hours at the computer.",
        features: [
            "Blue light filtering technology",
            "Anti-glare coating",
            "Lightweight frame",
            "Reduces eye fatigue"
        ],
        colors: ["Black", "Tortoise", "Clear"],
        images: [
            "https://placehold.co/600x400?text=Computer+Glasses",
            "https://placehold.co/600x400?text=Computer+Side",
            "https://placehold.co/600x400?text=Computer+Angle"
        ],
        rating: 4.8,
        reviews: 143,
        featured: true
    },
    {
        id: 7,
        name: "Oversized Sunglasses",
        category: "sunglasses",
        shape: "square",
        price: 159.99,
        description: "Make a statement with these oversized square sunglasses. Provides maximum coverage and UV protection.",
        features: [
            "Oversized design",
            "Polarized lenses",
            "100% UV protection",
            "Durable hinges"
        ],
        colors: ["Black", "Tortoise", "White"],
        images: [
            "https://placehold.co/600x400?text=Oversized+Sunglasses",
            "https://placehold.co/600x400?text=Oversized+Side",
            "https://placehold.co/600x400?text=Oversized+Angle"
        ],
        rating: 4.6,
        reviews: 78,
        featured: false
    },
    {
        id: 8,
        name: "Thin Metal Frame",
        category: "prescription",
        shape: "round",
        price: 119.99,
        description: "Minimalist round metal frames for a subtle, sophisticated look. Lightweight and comfortable for all-day wear.",
        features: [
            "Titanium frame",
            "Adjustable nose pads",
            "Anti-reflective coating",
            "Slim temple arms"
        ],
        colors: ["Gold", "Silver", "Black"],
        images: [
            "https://placehold.co/600x400?text=Thin+Metal+Frame",
            "https://placehold.co/600x400?text=Metal+Frame+Side",
            "https://placehold.co/600x400?text=Metal+Frame+Angle"
        ],
        rating: 4.7,
        reviews: 91,
        featured: false
    },
    {
        id: 9,
        name: "Bifocal Readers",
        category: "reading",
        shape: "rectangle",
        price: 79.99,
        description: "Convenient bifocal reading glasses with clear distance vision and reading magnification in the lower portion.",
        features: [
            "Bifocal design",
            "Spring hinges",
            "Multiple strengths available",
            "Includes case and cleaning cloth"
        ],
        colors: ["Black", "Brown", "Gray"],
        images: [
            "https://placehold.co/600x400?text=Bifocal+Readers",
            "https://placehold.co/600x400?text=Bifocal+Side",
            "https://placehold.co/600x400?text=Bifocal+Angle"
        ],
        rating: 4.4,
        reviews: 56,
        featured: false
    },
    {
        id: 10,
        name: "Gaming Glasses",
        category: "computer",
        shape: "square",
        price: 99.99,
        description: "Designed specifically for gamers, these glasses reduce eye strain during long gaming sessions and improve visual contrast.",
        features: [
            "Blue light filtering",
            "Anti-glare coating",
            "Enhanced contrast",
            "Comfortable fit with headsets"
        ],
        colors: ["Black", "Red", "Blue"],
        images: [
            "https://placehold.co/600x400?text=Gaming+Glasses",
            "https://placehold.co/600x400?text=Gaming+Side",
            "https://placehold.co/600x400?text=Gaming+Angle"
        ],
        rating: 4.9,
        reviews: 167,
        featured: false
    },
    {
        id: 11,
        name: "Retro Wayfarer",
        category: "sunglasses",
        shape: "square",
        price: 149.99,
        description: "Iconic wayfarer style sunglasses with a modern twist. These versatile frames suit almost any face shape.",
        features: [
            "Acetate frame",
            "Polarized lenses",
            "100% UV protection",
            "Durable 5-barrel hinges"
        ],
        colors: ["Black", "Tortoise", "Navy"],
        images: [
            "https://placehold.co/600x400?text=Retro+Wayfarer",
            "https://placehold.co/600x400?text=Wayfarer+Side",
            "https://placehold.co/600x400?text=Wayfarer+Angle"
        ],
        rating: 4.8,
        reviews: 132,
        featured: false
    },
    {
        id: 12,
        name: "Rimless Titanium",
        category: "prescription",
        shape: "rectangle",
        price: 199.99,
        description: "Elegant rimless titanium frames for a sophisticated, barely-there look. Extremely lightweight and comfortable.",
        features: [
            "Titanium frame",
            "Rimless design",
            "Adjustable nose pads",
            "Anti-reflective coating"
        ],
        colors: ["Silver", "Gold", "Gunmetal"],
        images: [
            "https://placehold.co/600x400?text=Rimless+Titanium",
            "https://placehold.co/600x400?text=Rimless+Side",
            "https://placehold.co/600x400?text=Rimless+Angle"
        ],
        rating: 4.7,
        reviews: 89,
        featured: false
    }
];