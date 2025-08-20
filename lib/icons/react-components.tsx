import React from 'react'
import { iconDefinitions } from './definitions'

interface IconProps {
  size?: number
  className?: string
  onClick?: () => void
}

export const GitHubIcon: React.FC<IconProps> = ({ size = 20, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.github }}
  />
)

export const CopyIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.copy }}
  />
)

export const CheckIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.check }}
  />
)

export const DragHandleIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <div 
    className={className}
    style={{ width: size, height: size, cursor: 'grab' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.dragHandle }}
  />
)

export const ChevronUpIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.chevronUp }}
  />
)

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.chevronDown }}
  />
)

export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.externalLink }}
  />
)

export const PlayIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.play }}
  />
)

export const XIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.x }}
  />
)

export const PlusIcon: React.FC<IconProps> = ({ size = 16, className, onClick }) => (
  <div 
    className={className}
    onClick={onClick}
    style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.plus }}
  />
)

export const LoadingIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <div 
    className={`animate-spin ${className || ''}`}
    style={{ width: size, height: size }}
    dangerouslySetInnerHTML={{ __html: iconDefinitions.loading }}
  />
)