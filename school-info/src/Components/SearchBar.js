import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import "../ComponentsCSS/SearchBar.css"

function SearchBar(props) {

  const clearInput = () => {
    props.setFilteredPost([])
    props.setTextEntered("")
  }

  return (
    <div className='search'>
      <div className='search-container'>
        <div className='search-icon'>
          {props.filteredPost.length === 0 ?
            <SearchIcon /> :
            <CloseIcon id='clearBtn' onClick={clearInput} />}
        </div>
        <input
          type='text'
          placeholder={props.placeholder}
          onChange={(e) => props.handleFilter(e, props.filteredPost)}
          value={props.textEntered} />
      </div>
      {props.filteredPost.length !== 0 && (
        <div className='data-result'>
          {props.filteredPost.slice(0, 5).map((post) => {
            return (
              <Link key={post.id} to={`./Post/${post.values.title.trim().replace(/\s+/g, '-')}/${post.id}`}>
                <p id={post.id}>{post.values.title}</p>
              </Link>
            )
          }
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar