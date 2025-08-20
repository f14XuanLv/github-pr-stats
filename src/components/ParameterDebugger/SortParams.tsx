import React, { useEffect, useRef } from 'react'
import { useSortCards } from '../../hooks/useParams'
import type { APIParams, SortCard } from '../../types'

interface SortParamsProps {
  params: APIParams
  onParamChange: <K extends keyof APIParams>(key: K, value: APIParams[K]) => void
}

const SORT_COLORS = ['#0969da', '#1f883d', '#8250df', '#d1242f', '#fb8500']

interface BreadcrumbCardProps {
  card: SortCard
  index: number
  isFirst: boolean
  onRemove: () => void
}

const BreadcrumbCard: React.FC<BreadcrumbCardProps> = ({ card, index, isFirst, onRemove }) => {
  const arrowSize = '10px'
  const color = SORT_COLORS[index % SORT_COLORS.length]
  
  const clipPath = isFirst
    ? `polygon(0% 0%, calc(100% - ${arrowSize}) 0%, 100% 50%, calc(100% - ${arrowSize}) 100%, 0% 100%)`
    : `polygon(0% 0%, calc(100% - ${arrowSize}) 0%, 100% 50%, calc(100% - ${arrowSize}) 100%, 0% 100%, ${arrowSize} 50%)`
  
  const marginLeft = isFirst ? '0' : `-${arrowSize}`
  const paddingLeft = isFirst ? '8px' : '14px'

  return (
    <div
      className="breadcrumb-card"
      style={{
        backgroundColor: color,
        clipPath,
        marginLeft,
        paddingLeft,
        paddingRight: '6px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '500',
        position: 'relative',
        zIndex: SORT_COLORS.length - index
      }}
    >
      <span>{card.label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="breadcrumb-remove"
        style={{
          marginLeft: '6px',
          padding: '2px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          fontSize: '12px',
          lineHeight: '1'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
        aria-label={`Remove ${card.label}`}
      >
        ×
      </button>
    </div>
  )
}

export const SortParams: React.FC<SortParamsProps> = ({
  params,
  onParamChange
}) => {
  const {
    selectedCards,
    availableCards,
    updateSelectedCards,
    getSortString,
    getAvailableCardsForGroup,
    resetToSortString
  } = useSortCards(params.sort)

  // Filter available cards based on current mode
  const getFilteredCardsForGroup = (group: string) => {
    return getAvailableCardsForGroup(group).filter(card => 
      card.mode === 'both' || card.mode === params.mode
    )
  }

  // Get unique groups available for current mode
  const availableGroups = [...new Set(
    availableCards
      .filter(card => card.mode === 'both' || card.mode === params.mode)
      .map(card => card.group)
  )]

  // Track previous mode to detect mode changes
  const prevMode = useRef(params.mode)
  
  useEffect(() => {
    // If mode changed, reset sort cards to the new mode's sort string
    if (prevMode.current !== params.mode) {
      resetToSortString(params.sort)
      prevMode.current = params.mode
    }
  }, [params.mode, params.sort, resetToSortString])

  useEffect(() => {
    const sortString = getSortString()
    // Only update if sortString is different and not empty, and this isn't an initialization
    if (sortString && sortString !== params.sort) {
      onParamChange('sort', sortString)
    }
  }, [selectedCards, getSortString, params.sort, onParamChange])

  const handleCardRemove = (index: number) => {
    const newCards = selectedCards.filter((_, i) => i !== index)
    updateSelectedCards(newCards)
  }

  const handleCardAdd = (card: SortCard) => {
    const existingGroupIndex = selectedCards.findIndex(c => c.group === card.group)
    let newCards = [...selectedCards]
    
    if (existingGroupIndex >= 0) {
      newCards[existingGroupIndex] = { ...card, id: Date.now().toString() }
    } else {
      newCards.push({ ...card, id: Date.now().toString() })
    }
    
    updateSelectedCards(newCards)
  }

  return (
    <div className="param-section">
      <h3>Sort Parameters</h3>
      
      <div className="sort-container">
        <div className="sort-selected-breadcrumb">
          {selectedCards.length > 0 ? (
            <div className="breadcrumb-trail">
              {selectedCards.map((card, index) => (
                <BreadcrumbCard
                  key={card.id}
                  card={card}
                  index={index}
                  isFirst={index === 0}
                  onRemove={() => handleCardRemove(index)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              Click cards below to add sorting criteria
            </div>
          )}
        </div>
        
        <div className="sort-divider"></div>
        
        <div className="sort-available">
          {availableGroups.map(group => {
            const groupCards = getFilteredCardsForGroup(group)
            if (groupCards.length === 0) return null
            
            const groupLabels = {
              status: 'Status',
              stars: 'Stars', 
              date: 'Date',
              merged: 'Merged',
              merged_rate: 'Merged Rate'
            }
            
            return (
              <div key={group} className="sort-group">
                <div className="group-label">{groupLabels[group as keyof typeof groupLabels] || group}</div>
                <div className="group-cards">
                  {groupCards.map(card => (
                    <div
                      key={card.id}
                      className="sort-card available"
                      onClick={() => handleCardAdd(card)}
                    >
                      {card.label}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}