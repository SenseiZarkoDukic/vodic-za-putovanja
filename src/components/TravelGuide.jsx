import React, { useState, useEffect, useRef } from 'react';

// Image component with loading state
const OptimizedImage = ( { src, alt, className, caption } ) => {
    const [ isLoading, setIsLoading ] = useState( true );

    return (
        <div className="relative w-full">
            { isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
            ) }
            <img
                src={ src }
                alt={ alt }
                className={ `${ className } ${ isLoading ? 'opacity-0' : 'opacity-100' } transition-opacity duration-300` }
                onLoad={ () => setIsLoading( false ) }
            />
            { caption && (
                <p className="absolute bottom-1 left-0 right-0 text-white text-xs bg-black bg-opacity-50 p-1">
                    { caption }
                </p>
            ) }
        </div>
    );
};

// Main App component
const App = () => {
    const [ activeSection, setActiveSection ] = useState( 'intro' );
    const sectionRefs = useRef( {} );

    const sections = [
        { id: 'intro', title: 'Uvod: Vaša idealna balkanska i jonska odiseja' },
        { id: 'day1', title: 'Dan 1: Beograd do Bitolja' },
        { id: 'day2', title: 'Dan 2: Bitolj do Perdike' },
        { id: 'days3-15', title: 'Dani 3-15: Jonski dragulji' },
        { id: 'day16', title: 'Dan 16: E75 povratak kući' },
        { id: 'practical', title: 'Praktična razmatranja' },
        { id: 'conclusion', title: 'Zaključak' },
    ];

    useEffect( () => {
        const observer = new IntersectionObserver(
            ( entries ) => {
                entries.forEach( ( entry ) => {
                    if ( entry.isIntersecting ) {
                        setActiveSection( entry.target.id );
                    }
                } );
            },
            {
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            }
        );

        sections.forEach( ( { id } ) => {
            const element = document.getElementById( id );
            if ( element ) {
                observer.observe( element );
                sectionRefs.current[ id ] = element;
            }
        } );

        return () => {
            sections.forEach( ( { id } ) => {
                const element = sectionRefs.current[ id ];
                if ( element ) {
                    observer.unobserve( element );
                }
            } );
        };
    }, [] );

    const scrollToSection = ( id ) => {
        const element = sectionRefs.current[ id ];
        if ( element ) {
            element.scrollIntoView( { behavior: 'smooth' } );
            setActiveSection( id );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
            {/* Navigation Bar */ }
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg p-4">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-xl font-bold text-blue-800 mb-4 md:mb-0">
                            Balkanska Odiseja
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                            { sections.map( ( section ) => (
                                <button
                                    key={ section.id }
                                    onClick={ () => scrollToSection( section.id ) }
                                    className={ `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                        ${ activeSection === section.id
                                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                                        }` }
                                >
                                    { section.title.split( ':' )[ 0 ] }
                                </button>
                            ) ) }
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 pt-32 pb-16">

                {/* Hero Section */ }
                <header id="intro" className="text-center mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h1 className="text-5xl font-extrabold text-blue-800 mb-4 leading-tight">
                        Vaša Idealna Balkanska i Jonska Odiseja
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">Beograd - Bitolj - Perdika - Beograd (16 dana)</p>
                    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg">
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                            alt="Mapa Balkana"
                            className="w-full h-auto object-cover"
                            caption="Putovanje kroz istoriju, kulturu i prirodne lepote Balkana i Jonskog mora."
                        />
                    </div>
                    <p className="mt-8 text-lg leading-relaxed">
                        Ova 16-dnevna ekspedicija obećava neuporedivu kombinaciju istorijske dubine, živahne kulture i prelepih prirodnih pejzaža, protežući se od srca Srbije preko istorijskih raskrsnica Severne Makedonije, a kulminira u mirnoj lepoti grčke jonske obale. Putovanje je osmišljeno za putnike koji traže autentična iskustva, od drevnih ruševina i užurbanih bazara do mitskih reka i suncem okupanih plaža. Naglasak je na uranjanju u lokalne tradicije, uživanju u autentičnoj kuhinji i otkrivanju skrivenih dragulja Balkana i Jonskog mora.
                    </p>
                    <p className="mt-4 text-lg leading-relaxed">
                        Putovanje počinje u Beogradu, vodeći prema jugu do Bitolja za imerzivni noćni boravak u Severnoj Makedoniji. Glavni deo putovanja odvija se tokom 15 noćenja u zapanjujućoj regiji Perdika u Grčkoj, nudeći savršenu bazu za istraživanje skrivenih dragulja Jonskog mora. Povratak će uključivati pažljivo odabrano zaustavljanje duž rute E75 u južnoj Srbiji, osiguravajući tako celovitu i nezaboravnu petlju putovanja.
                    </p>
                </header>

                {/* Day 1 Section */ }
                <section id="day1" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 1: Beograd (Srbija) do Bitolja (Severna Makedonija)</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Istorijsko srce Severne Makedonije (1 noćenje)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jutarnja vožnja: Od srpskih ravnica do makedonskih planina</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop"
                                alt="Autoput u Srbiji"
                                className="w-full h-auto object-cover"
                                caption="Vožnja od Beograda do Bitolja (oko 567 km, ~5h 51min)."
                            />
                        </div>
                        <p className="text-gray-700">
                            Ova ruta nudi brz i slikovit prelaz iz srpskih ravnica u planinske krajolike Severne Makedonije. Za putnike koji žele maksimalno iskoristiti ograničeno vreme u Bitolju, efikasnost na granici je ključna.
                        </p>
                        <p className="font-bold text-blue-600 mt-2">
                            Savet za prelazak granice: Koristite granični prelaz Medžitlija-Niki za brži i lakši prelazak.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Bitolj: Grad konzula i drevnih odjeka</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Širok Sokak, Bitolj"
                                className="w-full h-auto object-cover"
                                caption="Dobrodošli u Bitolj, grad bogate istorije i kulture."
                            />
                        </div>
                        <p className="text-gray-700 mb-4">
                            Bitolj, drugi po veličini grad u Severnoj Makedoniji, nosi počasnu titulu "Grada konzula", što svedoči o njegovoj istorijskoj važnosti kao diplomatskog i trgovačkog centra tokom osmanskog perioda.
                        </p>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Obavezno posetiti znamenitosti:</h5>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Herakleja Linkestidska:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
                                        alt="Mozaici u Herakleji Linkestidskoj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Drevno arheološko nalazište sa rimskim i vizantijskim ostacima.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Širok Sokak:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
                                        alt="Širok Sokak noću"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Živahna pešačka ulica, srce modernog Bitolja.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Sahat-kula (Saat Kula):</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
                                        alt="Sahat-kula, Bitolj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Istaknuti simbol Bitolja iz 16. veka.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Crkva sv. Dimitrija:</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
                                        alt="Crkva sv. Dimitrija, Bitolj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Značajno versko nasleđe, poznata po freskama.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Stari bazar (Stara Čaršija):</span>
                                <div className="relative w-32 h-24 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
                                        alt="Stari bazar, Bitolj"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Istorijska tržnica sa lokalnim rukotvorinama i proizvodima.
                            </li>
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Kulturno uranjanje</h4>
                        <p className="text-gray-700">
                            Bitolj slavi razne kulturne i umetničke događaje tokom cele godine. Značajni festivali uključuju renomirani Međunarodni festival filmske kamere "Braća Manaki", Bitoljski Šekspir Festival i Bitola Babam Bitola Festival. Moguće su sesije tradicionalne muzike u **Guest House Via**.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Blagovanje i noćenje: Autentični makedonski ukusi</h4>
                        <p className="text-gray-700 mb-4">
                            Za ukus tradicionalne makedonske kuhinje, razmotrite:
                            <ul className="list-disc list-inside ml-4">
                                <li><span className="font-bold">Restoran Oscar:</span> Tradicionalna makedonska kuhinja (blizu Pelistera).</li>
                                <li><span className="font-bold">Etno restoran Brioni:</span> Tradicionalna jela i mesni specijaliteti.</li>
                                <li><span className="font-bold">Ravenna (Širok Sokak):</span> Balkanska jela poput ćevapa.</li>
                            </ul>
                        </p>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Preporučeni smeštaj u Bitolju:</h5>
                        <div className="overflow-x-auto rounded-lg shadow-md">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-blue-100 text-blue-700 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Naziv hotela</th>
                                        <th className="py-3 px-6 text-left">Ocena (od 5)</th>
                                        <th className="py-3 px-6 text-left">Ključne karakteristike</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Hotel Epinal - Bitolj</td>
                                        <td className="py-3 px-6 text-left">4.5</td>
                                        <td className="py-3 px-6 text-left">Centralna lokacija</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Hotel Bulevar</td>
                                        <td className="py-3 px-6 text-left">3.5</td>
                                        <td className="py-3 px-6 text-left">Centralna lokacija</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-blue-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap font-bold">Guest House Via</td>
                                        <td className="py-3 px-6 text-left font-bold">9.2 (od 10)</td>
                                        <td className="py-3 px-6 text-left font-bold">Kulturna razmena, sesije tradicionalne muzike</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Robevski luxury rooms</td>
                                        <td className="py-3 px-6 text-left">9.4 (od 10)</td>
                                        <td className="py-3 px-6 text-left">Visoko ocenjen, luksuzan</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Central Exclusive Apartment/Penthouse</td>
                                        <td className="py-3 px-6 text-left">9.5 (od 10)</td>
                                        <td className="py-3 px-6 text-left">Visoko ocenjen, prostran</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Hotel Theatre</td>
                                        <td className="py-3 px-6 text-left">9.2 (od 10)</td>
                                        <td className="py-3 px-6 text-left">Visoko ocenjen, udoban</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Bela Kuka Hotel</td>
                                        <td className="py-3 px-6 text-left">8.9 (od 10)</td>
                                        <td className="py-3 px-6 text-left">Visoko ocenjen, prijatan</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Day 2 Section */ }
                <section id="day2" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 2: Bitolj (Severna Makedonija) do Perdike (Grčka)</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Vrata jonske obale (Početak 15 noćenja u Grčkoj)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jutro: Prelazak granice Medžitlija-Niki</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Granični prelaz Medžitlija-Niki"
                                className="w-full h-auto object-cover"
                                caption="Glatki prelaz sa malo prometa van špica."
                            />
                        </div>
                        <p className="text-gray-700">
                            Izravni granični prelaz između Bitolja (Severna Makedonija) i Florine (Grčka) poznat je kao Medžitlija-Niki. Ovaj prelaz je poznat po relativno niskom prometu, često sa "gotovo nikakvim prometom" tokom tipičnih sati sieste i ručka, što ga čini glatkom tranzicionom tačkom.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Slikovita vožnja do Perdike: Prvi pogledi na grčki Epir</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Regija Epir, Grčka"
                                className="w-full h-auto object-cover"
                                caption="Vožnja od oko 311 km (~3h 57min) preko Florine, Kozanija i Janjine do Perdike (izbegavajte direktnu E75)."
                            />
                        </div>
                        <p className="text-gray-700">
                            Udaljenost vožnje od Bitolja do Perdike iznosi otprilike 311,3 km, što se automobilom može preći za oko 3 sata i 57 minuta. Ova ruta je opisana kao "oko 50 km kraća i nešto jeftinija" od korišćenja glavnog koridora autoputa E75.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Perdika: Obalni šarm i jonski doček</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Plaža Karavostasi, Perdika"
                                className="w-full h-auto object-cover"
                                caption="Dobrodošli u Perdiku, sa prelepim plažama i tradicionalnim karakterom."
                            />
                        </div>
                        <p className="text-gray-700 mb-4">
                            Perdika je šarmantno selo u regiji Epir, slavljeno zbog svojih prelepih plaža i autentičnog tradicionalnog karaktera.
                        </p>
                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Početno istraživanje i opuštanje na plaži:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            { [
                                { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop", alt: "Plaža Karavostasi detalj", name: "Plaža Karavostasi", desc: "Najduža plaža sa peskom i oblucima, organizovana." },
                                { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop", alt: "Plaža Arillas", name: "Plaža Arillas", desc: "Plitka voda, idealna za porodice." },
                                { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop", alt: "Plaža Agia Paraskevi", name: "Plaža Agia Paraskevi", desc: "Tirkizna voda, slikovito ostrvce." },
                                { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop", alt: "Plaža Kamini", name: "Plaža Kamini", desc: "Mala, slikovita šljunčana uvala." },
                                { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop", alt: "Plaža Sofas", name: "Plaža Sofas", desc: "Relativno duga plaža sa kristalno čistim vodama." },
                            ].map( ( beach, index ) => (
                                <div key={ index } className="bg-blue-50 p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                                    <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden shadow-md">
                                        <OptimizedImage
                                            src={ beach.src }
                                            alt={ beach.alt }
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h6 className="font-bold text-md text-blue-700">{ beach.name }</h6>
                                    <p className="text-sm text-gray-600">{ beach.desc }</p>
                                </div>
                            ) ) }
                        </div>

                        <h5 className="text-lg font-semibold text-gray-700 mb-2">Prvi ukus sveže grčke morske hrane:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                                <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden shadow-md">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                        alt="Nontas Fish Restaurant"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h6 className="font-bold text-md text-blue-700">Nontas Fish Restaurant</h6>
                                <p className="text-sm text-gray-600">Renomirana, porodična tradicionalna taverna, specijalizovana za svežu morsku hranu i ribu.</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                                <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden shadow-md">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                        alt="The Crabs Tavern"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h6 className="font-bold text-md text-blue-700">The Crabs Tavern (Τα Καβούρια)</h6>
                                <p className="text-sm text-gray-600">Visoko preporučena zbog izuzetne kvalitete hrane, sa svežom morskom hranom i dnevnim specijalitetima.</p>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Pregled plaža u području Perdike:</h5>
                        <div className="overflow-x-auto rounded-lg shadow-md">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-blue-100 text-blue-700 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Naziv plaže</th>
                                        <th className="py-3 px-6 text-left">Sastav obale</th>
                                        <th className="py-3 px-6 text-left">Dubina vode</th>
                                        <th className="py-3 px-6 text-left">Organizacija</th>
                                        <th className="py-3 px-6 text-left">Dostupni sadržaji</th>
                                        <th className="py-3 px-6 text-left">Prikladnost</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Karavostasi</td>
                                        <td className="py-3 px-6 text-left">Fini pesak i oblutci</td>
                                        <td className="py-3 px-6 text-left">Duboka</td>
                                        <td className="py-3 px-6 text-left">Organizovana</td>
                                        <td className="py-3 px-6 text-left">Ležaljke, suncobrani, kafići, taverne, spasilac</td>
                                        <td className="py-3 px-6 text-left">Opšte opuštanje</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Arillas</td>
                                        <td className="py-3 px-6 text-left">Fini, lepljivi pesak</td>
                                        <td className="py-3 px-6 text-left">Plitka</td>
                                        <td className="py-3 px-6 text-left">Organizovana</td>
                                        <td className="py-3 px-6 text-left">Ležaljke, suncobrani, vodeni bicikli, tuševi, taverne</td>
                                        <td className="py-3 px-6 text-left">Porodice sa decom</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Agia Paraskevi</td>
                                        <td className="py-3 px-6 text-left">Fini pesak i oblutci</td>
                                        <td className="py-3 px-6 text-left">Tirkizna, čista</td>
                                        <td className="py-3 px-6 text-left">Organizovana</td>
                                        <td className="py-3 px-6 text-left">Ležaljke, suncobrani, vodeni bicikli, kanui, spasilac</td>
                                        <td className="py-3 px-6 text-left">Slikovito, opuštanje</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Kamini</td>
                                        <td className="py-3 px-6 text-left">Krupni pesak, šljunak, oblutci</td>
                                        <td className="py-3 px-6 text-left">Tirkizna, čista</td>
                                        <td className="py-3 px-6 text-left">Organizovana</td>
                                        <td className="py-3 px-6 text-left">Ležaljke, suncobrani, taverna, kafić</td>
                                        <td className="py-3 px-6 text-left">Mirno opuštanje</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">Sofas</td>
                                        <td className="py-3 px-6 text-left">Debeli pesak, šljunak, oblutci</td>
                                        <td className="py-3 px-6 text-left">Kristalno čista, tirkizna</td>
                                        <td className="py-3 px-6 text-left">Neorganizovana</td>
                                        <td className="py-3 px-6 text-left">Osveženja i hrana iz obližnjeg kampa</td>
                                        <td className="py-3 px-6 text-left">Mirno opuštanje</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Days 3-15 Section */ }
                <section id="days3-15" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dani 3-15: Jonski dragulji – Istraživanje Perdike i šire</h2>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">(15 noćenja u Grčkoj)</h3>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Perdika: Vaše mirno obalsko utočište</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Pogled na Perdiku"
                                className="w-full h-auto object-cover"
                                caption='Uživajte u filozofiji "sporog putovanja" i istražite lokalni ritam.'
                            />
                        </div>
                        <p className="text-gray-700">
                            Sa 15 noćenja u Grčkoj, Perdika služi kao idealna baza za duboko opuštanje i istraživanje šire regije Epir. Dani se mogu provesti uživajući u opuštenoj atmosferi sela, njegovim raznolikim plažama i izuzetnoj kulinarskoj sceni.
                        </p>
                    </div>

                    <h4 className="text-xl font-medium text-gray-700 mb-4">Očaravajući jednodnevni izleti iz Perdike:</h4>

                    {/* Parga */ }
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl shadow-md">
                        <h5 className="text-2xl font-semibold text-blue-700 mb-3">Parga: Slikovit grad i zapanjujuće uvale</h5>
                        <p className="text-gray-700 mb-4">(približno 30-40 minuta vožnje)</p>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Parga pogled s dvorca"
                                className="w-full h-auto object-cover"
                                caption="Grad sa venecijanskim uticajem i prelepim plažama."
                            />
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Venecijanski dvorac:</span>
                                <div className="relative w-24 h-16 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop"
                                        alt="Venecijanski dvorac, Parga"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Panoramski pogledi, besplatan ulaz (9-19h).
                            </li>
                            <li><span className="font-bold">Plaže:</span> Valtos, Lichnos, Sarakiniko, Piso Krioneri, Ammoudia.</li>
                        </ul>
                        <div className="flex flex-wrap justify-center gap-4 mb-4">
                            <div className="relative w-40 h-28 rounded-lg overflow-hidden shadow-md">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                    alt="Plaža Valtos, Parga"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="relative w-40 h-28 rounded-lg overflow-hidden shadow-md">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                    alt="Plaža Lichnos, Parga"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <p className="text-gray-700">
                            <span className="font-bold">Blagovanje u Pargi:</span> The Captain's Restaurant (Valtos plaža), Fish Taverna Souli.
                        </p>
                    </div>

                    {/* Sivota */ }
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl shadow-md">
                        <h5 className="text-2xl font-semibold text-blue-700 mb-3">Sivota: "Karibi Grčke"</h5>
                        <p className="text-gray-700 mb-4">(približno 15-20 minuta vožnje)</p>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Pogled na Sivotu"
                                className="w-full h-auto object-cover"
                                caption="Egzotična lepota sa bujnim ostrvima i kristalno čistom vodom."
                            />
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Izleti brodom i Plava laguna:</span>
                                <div className="relative w-24 h-16 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                        alt="Plava laguna"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Obavezno posetiti tirkizne vode za ronjenje sa maskom.
                            </li>
                            <li><span className="font-bold">Plaže:</span> Bella Vraka, Pisina (Plava laguna), Mega Ammos, Mikri Ammos, Zavia, Gallikos Molos, Zeri.</li>
                        </ul>
                        <div className="flex flex-wrap justify-center gap-4 mb-4">
                            <div className="relative w-40 h-28 rounded-lg overflow-hidden shadow-md">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                    alt="Plaža Bella Vraka, Sivota"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="relative w-40 h-28 rounded-lg overflow-hidden shadow-md">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                    alt="Plaža Mega Ammos, Sivota"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <p className="text-gray-700">
                            <span className="font-bold">Blagovanje uz more:</span> Ionion Fish Restaurant (Mega Ammos), Oliva Beach Bar-Seafood Restaurant (Megali Ammos), Taverna Stavros (pogled na zaliv).
                        </p>
                    </div>

                    {/* Aheron River */ }
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl shadow-md">
                        <h5 className="text-2xl font-semibold text-blue-700 mb-3">Reka Aheront: Mitske vode i avanture na otvorenom</h5>
                        <p className="text-gray-700 mb-4">(približno 30-45 minuta vožnje do Glikija)</p>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Izvori reke Aheront"
                                className="w-full h-auto object-cover"
                                caption="Mesto sa mitološkom važnošću i mogućnostima za aktivnosti na otvorenom."
                            />
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Izvori Aheronta (Gliki):</span>
                                <div className="relative w-24 h-16 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                        alt="Aktivnosti na reci Aheront"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Rafting, kajak, jahanje, rečni trekking, biciklizam, streličarstvo, zip-line. Preporučuje se odgovarajuća obuća i vodootporna torba.
                            </li>
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Nekromanteion Aheronta:</span>
                                <div className="relative w-24 h-16 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                        alt="Nekromanteion Aheronta"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Drevno proročište, vrata u podzemni svet (ulaz ~6€).
                            </li>
                        </ul>
                    </div>

                    {/* Ioannina */ }
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl shadow-md">
                        <h5 className="text-2xl font-semibold text-blue-700 mb-3">Janina (opciono): Grad na jezeru sa vizantijskom baštinom</h5>
                        <p className="text-gray-700 mb-4">(približno 1,5-2 sata vožnje)</p>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Dvorac u Janini"
                                className="w-full h-auto object-cover"
                                caption="Živahan grad bogat istorijom i kulturom."
                            />
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><span className="font-bold">Dvorac u Janini:</span> Vizantijski i osmanski uticaji (besplatan ulaz, 8-22h).</li>
                            <li><span className="font-bold">Muzeji:</span> Arheološki, Vizantijski, Umetnička galerija.</li>
                            <li><span className="font-bold">Stari grad:</span> Šarmantne ulice i kafići.</li>
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Imerzivna kulturna iskustva u Epiru</h4>
                        <p className="text-gray-700">
                            Epir se može pohvaliti izrazitom i drevnom muzičkom tradicijom. Potražite lokalne muzičke izvedbe u tavernama poput **Tavern Grill Ksaderfos** (živa narodna i tradicionalna muzika) u blizini Perdike. Raspitajte se kod lokalnog stanovništva za preporuke u Pargi i Sivoti.
                        </p>
                    </div>
                </section>

                {/* Day 16 Section */ }
                <section id="day16" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Dan 16: E75 povratak kući – Ukus južne Srbije</h2>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Jutro: Oproštaj od jonske obale</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Jonska obala"
                                className="w-full h-auto object-cover"
                                caption="Krećemo natrag prema Beogradu (oko 887 km, ~9h 41min)."
                            />
                        </div>
                    </div>

                    <h4 className="text-xl font-medium text-gray-700 mb-4">Podnevno zaustavljanje: Ručak i odmor na koridoru E75</h4>
                    <p className="text-gray-700 mb-4">Odaberite **Niš** ili **Vranje** za ručak i odmor.</p>

                    {/* Nis Option */ }
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl shadow-md">
                        <h5 className="text-2xl font-semibold text-blue-700 mb-3">Opcija 1: Niš, Srbija – Tvrđava, Ćele Kula i legendarni roštilj</h5>
                        <p className="text-gray-700 mb-4">(oko 2h 30min vožnje od Beograda)</p>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Niška tvrđava"
                                className="w-full h-auto object-cover"
                                caption="Istorijska stanica na E75."
                            />
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Obavezno posetiti:</span>
                                <div className="relative w-24 h-16 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                        alt="Ćele Kula, Niš"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Niška tvrđava (besplatno, 24/7), Ćele Kula (~2.5€), Medijana.
                            </li>
                        </ul>
                        <p className="text-gray-700 mb-2"><span className="font-bold">Blagovanje u Nišu (poznat po roštilju):</span></p>
                        <ul className="list-disc list-inside ml-4">
                            <li><span className="font-bold">Kafana Mrak:</span> Visok kvalitet mesa.</li>
                            <li><span className="font-bold">Nišlijska Mehana:</span> Tradicionalna srpska jela, živa muzika (pet/sub).</li>
                            <li><span className="font-bold">Stara Srbija:</span> Izdašne porcije, živa narodna muzika svako veče.</li>
                            <li><span className="font-bold">Mali podrum (Podrumče):</span> Dobra hrana, atmosfera paba.</li>
                            <li><span className="font-bold">Hamam:</span> Pečena jagnjetina, živa balkanska muzika.</li>
                        </ul>
                    </div>

                    {/* Vranje Option */ }
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl shadow-md">
                        <h5 className="text-2xl font-semibold text-blue-700 mb-3">Opcija 2: Vranje, Srbija – Beli most i autentična srpska kuhinja</h5>
                        <p className="text-gray-700 mb-4">(oko 1h 15min vožnje od Skoplja)</p>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Beli most, Vranje"
                                className="w-full h-auto object-cover"
                                caption="Južnije na E75."
                            />
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li className="flex items-center">
                                <span className="font-bold mr-2">Obavezno posetiti:</span>
                                <div className="relative w-24 h-16 mr-2 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                        alt="Muzej Bore Stankovića, Vranje"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                Beli most, Muzej rodne kuće Bore Stankovića, Saborna crkva Svete Trojice.
                            </li>
                        </ul>
                        <p className="text-gray-700 mb-2"><span className="font-bold">Blagovanje u Vranju:</span></p>
                        <ul className="list-disc list-inside ml-4">
                            <li><span className="font-bold">Restoran Čaršija:</span> Nudi tradicionalnu srpsku kuhinju.</li>
                            <li><span className="font-bold">Tradicionalni srpski restoran:</span> Autentična srpska kuhinja uz živu tradicionalnu muziku.</li>
                            <li><span className="font-bold">Gradska Meana i Restoran Morava:</span> Takođe nude tradicionalnu hranu.</li>
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Veče: Dolazak natrag u Beograd</h4>
                        <div className="relative w-full max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                                alt="Beograd"
                                className="w-full h-auto object-cover"
                                caption="Završetak vašeg putovanja u Beogradu."
                            />
                        </div>
                    </div>
                </section>

                {/* Practical Considerations Section */ }
                <section id="practical" className="mb-16 p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Praktična razmatranja za vaše putovanje</h2>
                    <ul className="list-disc list-inside space-y-4 text-gray-700">
                        <li>
                            <span className="font-bold">Granice:</span> Proverite valjanost pasoša i dokumenata za vozilo (međunarodna vozačka dozvola, zeleni karton). Budite spremni na moguće gužve.
                        </li>
                        <li>
                            <span className="font-bold">Valuta:</span> Severna Makedonija koristi makedonski denar (MKD). Grčka koristi euro (EUR). Srbija koristi srpski dinar (RSD). Preporučljivo je imati nešto lokalne valute za manje kupovine ili koristiti bankomate za podizanje novca.
                        </li>
                        <li>
                            <span className="font-bold">Saveti za vožnju:</span>
                            <ul className="list-circle list-inside ml-6 space-y-1">
                                <li><span className="font-semibold">Severna Makedonija:</span> Putevi su generalno dobri, posebno autoputevi. Benzin (Super 95) je navodno jeftiniji u Severnoj Makedoniji u poređenju sa Srbijom ili Crnom Gorom.</li>
                                <li><span className="font-semibold">Srbija:</span> Budite svesni značajne prisutnosti policije i strogih propisa o parkiranju; korišćenje lokalnih SIM kartica za SMS-parking može biti problem za strane vozače. Putarine su prisutne na autoputevima, obično oko 1 USD na 20 km.</li>
                                <li><span className="font-semibold">Grčka (Epir):</span> Vožnja je generalno jednostavna, sa jasnim saobraćajnim znakovima.</li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-bold">Smeštaj:</span> Preporučuje se rezervisanje smeštaja unapred, posebno tokom vrhunca sezone putovanja, naročito za jedinstvena mesta poput Guest House Via u Bitolju ili popularnih obalskih područja u Grčkoj.
                        </li>
                        <li>
                            <span className="font-bold">Jezik:</span> Iako se engleski često govori u turističkim područjima, učenje nekoliko osnovnih fraza na makedonskom, srpskom i grčkom jeziku može značajno poboljšati interakciju sa lokalnim stanovništvom i obogatiti kulturno iskustvo.
                        </li>
                    </ul>
                </section>

                {/* Conclusion Section */ }
                <section id="conclusion" className="text-center p-8 bg-white rounded-3xl shadow-xl">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Zaključak: Dragocene uspomene na Balkan i Grčku</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Nadamo se da će vam ovaj vodič pomoći da stvorite nezaboravne uspomene na vašem idealnom 16-dnevnom putovanju! Želimo vam srećan put i da ovo letovanje bude najlepše u životu!
                    </p>
                    <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg">
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop"
                            alt="Kraj putovanja"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default App;
