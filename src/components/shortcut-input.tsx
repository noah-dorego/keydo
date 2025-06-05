import React, { useState, useEffect, useCallback } from 'react';
import { Key, keyMap } from '@/frontend/types.ts';
import { Button } from '@/components/ui/button.tsx';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { KeySlot } from '@/components/KeySlot.tsx'; // Import the new KeySlot component

export interface ShortcutKey {
  modifier?: (Key | null)[]; // Allow null for placeholder modifiers
  key: Key | null;
}

interface ShortcutInputProps {
  shortcut: ShortcutKey | null;
  setShortcut: (shortcut: ShortcutKey | null) => void;
}

export function ShortcutInput({ shortcut, setShortcut }: ShortcutInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [listeningKeyIndex, setListeningKeyIndex] = useState<number | 'main' | null>(null);

  const handleKeyElementClick = (index: number | 'main') => {
    if (isListening && listeningKeyIndex !== index) { // If listening elsewhere, stop and start listening here
        setIsListening(false); // This will trigger cleanup in useEffect
    }
    setListeningKeyIndex(index);
    setIsListening(true);
  };

  const handleAddModifier = () => {
    if (isListening) return;
    const currentModifiers = shortcut?.modifier || [];
    if (shortcut?.key && currentModifiers.length < 4) {
      // Add null as a placeholder for the new modifier key to be set
      const newShortcut = { 
        ...shortcut,
        modifier: [...currentModifiers, null]
      };
      setShortcut(newShortcut);
      handleKeyElementClick(currentModifiers.length); // Listen for the new modifier key
    } else if (!shortcut?.key) {
      alert("Please set the main key first or click an empty slot.");
    }
  };

  const handleRemoveModifier = () => {
    if (!isListening || typeof listeningKeyIndex !== 'number' || !shortcut?.modifier) return;
    
    const currentModifiers = shortcut.modifier;
    const newModifiers = currentModifiers.filter((_, index) => index !== listeningKeyIndex);
    
    const newShortcut = {
      ...shortcut,
      modifier: newModifiers.length > 0 ? newModifiers : []
    };
    
    setShortcut(newShortcut);
    setIsListening(false);
    setListeningKeyIndex(null);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isListening || listeningKeyIndex === null) return;

    event.preventDefault();
    event.stopPropagation();

    let pressedKeyValue = event.key;
    // Special handling for Spacebar as event.key can be " "
    if (event.code === 'Space') pressedKeyValue = 'Space'; 
    // For modifiers, event.key might be more reliable (e.g., "Control", "Shift")
    // For letter keys, it could be "a" or "A" - keyMap should handle this or normalize to lowercase for letters
    // If Key enum uses lowercase for letters, ensure keyMap reflects that or normalize `pressedKeyValue`
    
    const mappedKey = keyMap[pressedKeyValue] || keyMap[event.code] || (Object.values(Key).includes(pressedKeyValue as Key) ? pressedKeyValue as Key : null) ;

    if (mappedKey) {
      const newShortcut: ShortcutKey = shortcut ? { ...shortcut, modifier: shortcut.modifier ? [...shortcut.modifier] : [] } : { key: null, modifier: [] };
      if (!newShortcut.modifier) newShortcut.modifier = []; // Should be redundant due to above line

      if (listeningKeyIndex === 'main') {
        // Prevent setting a modifier as a main key if it's already a modifier
        if (newShortcut.modifier.includes(mappedKey)) {
            alert(`The key "${mappedKey}" is already set as a modifier.`);
        } else {
            newShortcut.key = mappedKey;
        }
      } else if (typeof listeningKeyIndex === 'number') {
        // Prevent setting main key as a modifier or duplicate modifiers
        if (newShortcut.key === mappedKey || (newShortcut.modifier.includes(mappedKey) && newShortcut.modifier[listeningKeyIndex] !== mappedKey) ) {
            alert(`The key "${mappedKey}" is already in use in this shortcut.`);
        } else {
            // Ensure modifier array is long enough
            while (newShortcut.modifier.length <= listeningKeyIndex) {
              newShortcut.modifier.push(null);
            }
            newShortcut.modifier[listeningKeyIndex] = mappedKey;
        }
      }
      // Filter out nulls from modifiers only if they are not the ones currently being listened to, to keep placeholders
      newShortcut.modifier = newShortcut.modifier.filter((mod, idx) => mod !== null || (isListening && listeningKeyIndex === idx));
      if(newShortcut.modifier.length === 0 && newShortcut.key === null) {
        setShortcut(null); // If everything is cleared, set shortcut to null
      } else {
        setShortcut(newShortcut);
      }
    }
    
    setIsListening(false);
    setListeningKeyIndex(null);
  }, [isListening, listeningKeyIndex, shortcut, setShortcut]);

  useEffect(() => {
    if (isListening) {
      document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    } else {
      document.removeEventListener('keydown', handleKeyDown, true);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isListening, handleKeyDown]);

  const currentModifiers = shortcut?.modifier || [];
  const mainKey = shortcut?.key || null;
  const maxModifiers = 4;

  // Determine if Remove Modifier button should be enabled
  const canRemoveModifier = isListening && 
                           typeof listeningKeyIndex === 'number' && 
                           currentModifiers.filter(m => m !== null).length > 1;

  // Changed let to const for displayModifiers as it's not reassigned directly
  const initialDisplayModifiers = [...currentModifiers];
  if (!isListening && mainKey && initialDisplayModifiers.length < maxModifiers) {
      if (!initialDisplayModifiers.includes(null)) {
        initialDisplayModifiers.push(null);
      }
  }
  if (isListening && typeof listeningKeyIndex === 'number' && listeningKeyIndex >= currentModifiers.length && !initialDisplayModifiers[listeningKeyIndex]) {
      while(initialDisplayModifiers.length <= listeningKeyIndex) {
        initialDisplayModifiers.push(null);
      }
  }
  const displayModifiers = initialDisplayModifiers; // Assign to final const

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Set Shortcut Combination</h4>
      <div className="flex items-center flex-wrap gap-1 p-2 bg-muted rounded-md min-h-[50px]">
        {displayModifiers.map((modKey, index) => (
          modKey !== null || (isListening && listeningKeyIndex === index) ? (
            <React.Fragment key={`mod-frag-${index}`}>
              <KeySlot 
                keyVal={modKey} 
                isListening={isListening && listeningKeyIndex === index}
                onClick={() => handleKeyElementClick(index)}
              />
              {/* Add plus sign if not the last rendered modifier OR if there's a main key following this modifier slot*/}
              { (index < displayModifiers.filter(m => m !== null || (isListening && listeningKeyIndex === index)).length - 1 || mainKey || (isListening && listeningKeyIndex === 'main')) && 
                (mainKey || displayModifiers.filter(m => m !== null).length > index +1 ) && /* Add + if a main key exists or another actual modifier follows */ 
                <span className="mx-1 self-center">+</span>
              }
            </React.Fragment>
          ) : null
        ))}
        
        {/* Placeholder for the first modifier if no modifiers and no main key yet, but we are not listening for the main key */}
        {!mainKey && displayModifiers.filter(m => m !== null).length === 0 && (!isListening || listeningKeyIndex !== 'main') && (
            <KeySlot 
                keyVal={null} 
                isListening={isListening && listeningKeyIndex === 0} // Assuming 0 for first potential modifier
                onClick={() => handleKeyElementClick(0)} 
            />
        )}
        {/* Main Key Slot */}
        <KeySlot 
            keyVal={mainKey} 
            isListening={isListening && listeningKeyIndex === 'main'}
            onClick={() => handleKeyElementClick('main')}
        />
        
        {!mainKey && displayModifiers.filter(m => m !== null).length === 0 && !isListening && (
             <span className="text-muted-foreground text-sm p-1 ml-2">Click a slot to set a key.</span>
        )}
      </div>
      <div className="mt-3 gap-2 flex flex-row">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddModifier} 
          disabled={isListening || (mainKey && currentModifiers.filter(m => m !== null).length >= maxModifiers) || !mainKey}
          className="align-middle"
          title={!mainKey ? "Set main key first" : (currentModifiers.filter(m => m !== null).length >= maxModifiers ? "Max modifiers reached" : "Add modifier") }>
          <FaPlus className="h-4 w-4" /> Add Modifier
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleRemoveModifier} 
          disabled={!canRemoveModifier}
          className="align-middle"
          title={!canRemoveModifier ? "Select a modifier to remove (must have multiple modifiers)" : "Remove selected modifier"}>
          <FaTrash className="h-4 w-4" /> Remove Modifier
        </Button>
      </div>
    </div>
  );
} 