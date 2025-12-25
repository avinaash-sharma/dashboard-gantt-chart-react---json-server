import { useState } from 'react';
import { Users, DollarSign, TrendingUp, ChevronDown } from 'lucide-react';
import ResourceBurnCard from '../ResourceBurnCard/ResourceBurnCard';
import RevenueCard from '../RevenueCard/RevenueCard';
import GrossMarginCard from '../GrossMarginCard/GrossMarginCard';
import styles from './FinancialMetricsCard.module.css';

const FinancialMetricsCard = ({ resourceBurn, revenueData, grossMargin }) => {
  const [activeCard, setActiveCard] = useState('resourceBurn');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cardOptions = [
    { id: 'resourceBurn', label: 'Resource Burn', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'grossMargin', label: 'Gross Margin', icon: TrendingUp },
  ];

  const activeOption = cardOptions.find(opt => opt.id === activeCard);

  const handleOptionSelect = (optionId) => {
    setActiveCard(optionId);
    setIsDropdownOpen(false);
  };

  const renderActiveCard = () => {
    switch (activeCard) {
      case 'resourceBurn':
        return <ResourceBurnCard data={resourceBurn} />;
      case 'revenue':
        return <RevenueCard data={revenueData} />;
      case 'grossMargin':
        return <GrossMarginCard data={grossMargin} />;
      default:
        return <ResourceBurnCard data={resourceBurn} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectorWrapper}>
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownTrigger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <activeOption.icon size={14} />
            {activeOption.label}
            <ChevronDown size={14} className={`${styles.chevron} ${isDropdownOpen ? styles.open : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {cardOptions.map(option => (
                <button
                  key={option.id}
                  className={`${styles.dropdownItem} ${activeCard === option.id ? styles.active : ''}`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <option.icon size={14} />
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.quickTabs}>
          {cardOptions.map(option => (
            <button
              key={option.id}
              className={`${styles.quickTab} ${activeCard === option.id ? styles.activeTab : ''}`}
              onClick={() => setActiveCard(option.id)}
              title={option.label}
            >
              <option.icon size={14} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.cardWrapper}>
        {renderActiveCard()}
      </div>
    </div>
  );
};

export default FinancialMetricsCard;
