import { useState } from 'react'
import axios from 'axios'
import Select from 'react-select'
import styles from './search.module.css'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('Riyadh')
  const [selectedIndex, setSelectedIndex] = useState('restaurants')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/data-management/search`,
        {
          params: {
            index: selectedIndex,
            query: searchQuery,
            fields: selectedCategories.map(category => category.value),
            offset: (currentPage - 1) * 50,
            limit: 50
          }
        }
      )
      setResults(response.data)
    } catch (error) {
      console.error('Error fetching results:', error)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchResults()
  }

  const handlePagination = page => {
    setCurrentPage(page)
    fetchResults()
  }

  const indexOptions = [
    { value: 'products', label: 'Products' },
    { value: 'restaurants', label: 'Restaurants' },
    { value: 'ratings', label: 'Ratings' },
    { value: 'promotions', label: 'Promotions' }
  ]

  const indexCategories = {
    products: [
      { value: 'platform', label: 'Platform' },
      { value: 'category', label: 'Category' },
      { value: 'name', label: 'Name' },
      { value: 'description', label: 'Description' },
      { value: 'isAvailable', label: 'Available' },
      { value: 'isPopular', label: 'Popula' },
      { value: 'isSoldOut', label: 'Sold out' },
      { value: 'currency', label: 'Currency' },
      { value: 'price', label: 'Price' },
      { value: 'discountedPrice', label: 'Discount Price' },
      { value: 'discountAmount', label: 'Discount Amount' },
      { value: 'priceDiscountPercent', label: 'Discount Percentage' }
    ],
    restaurants: [
      { value: 'neighbourhood', label: 'Neighbourhood' },
      { value: 'phoneNumberOne', label: 'Phone Number' },
      { value: 'cityCode', label: 'City Code' },
      { value: 'cityName', label: 'City Name' },
      { value: 'categoryTags', label: 'Category Tags' }
    ],
    promotions: [
      { value: 'type', label: 'Type' },
      { value: 'price', label: 'Price' },
      { value: 'discountPercent', label: 'Discount Percentage' }
    ],
    rattings: [
      { value: 'rating', label: 'Rating' },
      { value: 'platformStoreRating', label: 'Platform Store Ratting' },
      { value: 'totalRating', label: 'Total Rating' }
    ]
  }

  return (
    <div>
      <div>
        <div className={styles['select-container']}>
          <Select
            placeholder='Select Index'
            options={indexOptions}
            value={indexOptions.find(option => option.value === selectedIndex)}
            onChange={selectedOption => setSelectedIndex(selectedOption.value)}
          />
          {selectedIndex && (
            <Select
              placeholder='Select Categories'
              options={indexCategories[selectedIndex]}
              isMulti
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
          )}
        </div>
      </div>
      <div>
        <input
          type='text'
          placeholder='Search Results...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className={styles['results-list']}>
        {results.map(result => (
          <div key={result.uuid} className={styles['result-card']}>
            <img
              src={result.imageUrl}
              alt={result.type}
              className={styles['result-image']}
            />
            <div className={styles['result-details']}>
              <h3>{result.type}</h3>
              <p>City: {result.cityName}</p>
              {indexCategories[selectedIndex]?.map(category => (
                <p key={category.value}>
                  {category.label}: {result[category.value]}
                </p>
              ))}
              <p>Scrape Date: {result.scrape_date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles['pagination']}>
        {Array.from(
          { length: Math.ceil(results.length / 50) },
          (_, i) => i + 1
        ).map(page => (
          <button key={page} onClick={() => handlePagination(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Search
